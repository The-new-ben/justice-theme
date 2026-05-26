import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const CTA_AUDIT_BASE = 'live-public-cta-density';
const HOMEPAGE_URL = 'https://jus-tice.co.il/';

const forbiddenPublicMarkers = [
  'revenue',
  'ARR',
  'MRR',
  'business plan',
  'Lawhive',
  'Harvey',
  'monetization',
  'package economics',
  '\u05d4\u05db\u05e0\u05e1\u05d4',
  '\u05e8\u05d5\u05d5\u05d7',
  '\u05de\u05d5\u05d3\u05dc \u05e2\u05e1\u05e7\u05d9',
  '\u05ea\u05db\u05e0\u05d9\u05ea \u05e2\u05e1\u05e7\u05d9\u05ea',
];

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    auditDate: process.env.AUDIT_DATE || process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--auditDate=')) {
      args.auditDate = arg.slice('--auditDate='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  for (const [name, value] of Object.entries(args)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error(`--${name} must be YYYY-MM-DD`);
    }
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `homepage-cta-density-review-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function auditPath(auditDate) {
  return path.join(ROOT, '.reports', `${CTA_AUDIT_BASE}-${auditDate}.json`);
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required CTA density audit JSON: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf8'));
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

function homepageRow(audit) {
  return (audit.rows || []).find((row) => row.path === '/' || row.url === HOMEPAGE_URL);
}

function buildRows(homepage) {
  const repeatedText = homepage?.repeated_text_groups || '-';
  const primaryCount = Number(homepage?.primary_cta_count || 0);
  const uniqueTextCount = Number(homepage?.unique_primary_cta_texts || 0);

  return [
    {
      id: 'HCTA-01',
      section: 'finding',
      status: homepage?.status === 'REVIEW' ? 'REVIEW_NEEDED' : 'SOURCE_AUDIT_NOT_REVIEW',
      item: 'Homepage repeated CTA density finding',
      evidence: `Homepage audit status: ${homepage?.status || 'missing'}; primary CTAs: ${primaryCount}; unique CTA texts: ${uniqueTextCount}; repeated text groups: ${repeatedText}.`,
      recommendation: 'Treat this as a visual/content decision before adding more homepage CTAs or managed-service copy.',
      owner_decision_needed: 'Confirm whether repeated lawyer-card action labels are acceptable, should be quieter, or should become contextual.',
      public_change_approved: 'no',
      blocker: 'No homepage CTA label, link, section or CMS change is approved by this packet.',
    },
    {
      id: 'HCTA-02',
      section: 'option',
      status: 'OPTION_LOW_RISK_KEEP_AS_IS',
      item: 'Option A - keep repeated labels for now',
      evidence: 'The repeated buttons point to different lawyer contact URLs and no repeated href group was found in the audit.',
      recommendation: 'Keep current live homepage unchanged until a broader homepage design pass is approved.',
      owner_decision_needed: 'Approve leaving the current repeated visible label as-is for now.',
      public_change_approved: 'no',
      blocker: 'Still block adding new homepage CTA blocks until density is reviewed again.',
    },
    {
      id: 'HCTA-03',
      section: 'option',
      status: 'OPTION_NEEDS_VISUAL_QA',
      item: 'Option B - make repeated lawyer-card actions visually quieter',
      evidence: 'The repeated text appears inside a card/list pattern, where each card can keep a local action without competing with main page CTAs.',
      recommendation: 'Consider a subtler secondary-action style or compact icon/text treatment for lawyer cards while keeping main legal-help CTAs clearer.',
      owner_decision_needed: 'Approve a design treatment after mobile and desktop screenshot review.',
      public_change_approved: 'no',
      blocker: 'Needs local theme diff, mobile screenshot, desktop screenshot and CTA density rerun before publication.',
    },
    {
      id: 'HCTA-04',
      section: 'option',
      status: 'OPTION_NEEDS_COPY_REVIEW',
      item: 'Option C - vary lawyer-card labels by user intent',
      evidence: 'The live homepage currently repeats one visible action label across several lawyer cards.',
      recommendation: `Test contextual labels such as "\u05e4\u05e8\u05d8\u05d9 \u05e2\u05d5\u05e8\u05da \u05d4\u05d3\u05d9\u05df" or "\u05d1\u05d3\u05d9\u05e7\u05ea \u05d4\u05ea\u05d0\u05de\u05d4" only if the actual target and user expectation match.`,
      owner_decision_needed: 'Approve exact Hebrew labels and decide whether card clicks go to contact or profile.',
      public_change_approved: 'no',
      blocker: 'Do not create misleading labels; copy needs user-intent review and link-destination review.',
    },
    {
      id: 'HCTA-05',
      section: 'option',
      status: 'OPTION_HIGHER_DESIGN_IMPACT',
      item: 'Option D - reduce lawyer-card CTA exposure',
      evidence: 'Homepage has 10 primary CTAs in the current audit, with lawyer-card actions making up most of the repeated visible label.',
      recommendation: 'Consider showing fewer cards or one section-level CTA if mobile feels too sales-heavy.',
      owner_decision_needed: 'Approve a larger homepage layout decision before implementation.',
      public_change_approved: 'no',
      blocker: 'Higher public UX impact; requires competitor-inspired design review and stronger visual QA.',
    },
    {
      id: 'HCTA-06',
      section: 'guardrail',
      status: 'HARD_GUARDRAIL',
      item: 'Keep public site as legal help first',
      evidence: 'Owner explicitly objected to public copy that exposes revenue logic or business-plan language.',
      recommendation: 'Any public homepage copy must stay reader-facing: legal problem, lawyer fit, guidance and trust.',
      owner_decision_needed: 'None until a concrete homepage change is proposed.',
      public_change_approved: 'no',
      blocker: 'No business-plan, revenue, package-economics, supplier marketplace or internal routing language on the public homepage.',
    },
    {
      id: 'HCTA-07',
      section: 'associated_pages',
      status: 'REVIEW_BEFORE_PUBLIC_CHANGE',
      item: 'Associated pages and surfaces to inspect',
      evidence: '/lawyers/; /find-lawyer-how-to-find-good-attorney/; /national-insurance-attorney/; /bituach-leumi-appeal-guide/; /rental-agreement/; /labor-lawyer/; /consumer-rights-israel/; /eviction-notice-israel/',
      recommendation: 'If homepage card actions change, inspect these pages for internal-link flow, repeated CTA language and cannibalization context.',
      owner_decision_needed: 'Choose whether homepage lawyer-card traffic should primarily feed lawyer profiles, contact forms or practice pages.',
      public_change_approved: 'no',
      blocker: 'No internal link or public route decision from this packet alone.',
    },
    {
      id: 'HCTA-08',
      section: 'qa_before_publication',
      status: 'REQUIRED_BEFORE_PUBLIC_CHANGE',
      item: 'Required QA before any homepage CTA change goes live',
      evidence: 'The current audit is read-only and does not include screenshots.',
      recommendation: 'Before publishing: mobile screenshot, desktop screenshot, live/public business-language audit, CTA density rerun, private artifact boundary guard and Hebrew owner email with associated-page notes.',
      owner_decision_needed: 'Approve exact implementation option first.',
      public_change_approved: 'no',
      blocker: 'No uPress pull or owner email until a real public change is implemented and live-verified.',
    },
  ];
}

function findForbiddenMarkerHits(rows) {
  const hits = [];
  for (const row of rows) {
    // The packet may privately name forbidden concepts as guardrails. Only scan
    // fields that could become public-facing direction or labels.
    const text = [
      row.recommendation,
      row.owner_decision_needed,
    ].join(' ').toLowerCase();

    for (const marker of forbiddenPublicMarkers) {
      if (text.includes(marker.toLowerCase())) {
        hits.push({
          id: row.id,
          section: row.section,
          marker,
        });
      }
    }
  }
  return hits;
}

function packetStatus(homepage, markerHits) {
  if (!homepage) {
    return 'BLOCKED_SOURCE_HOMEPAGE_ROW_MISSING';
  }

  if (homepage.http_status !== 200) {
    return 'BLOCKED_SOURCE_HOMEPAGE_NOT_200';
  }

  if (markerHits.length > 0) {
    return 'BLOCKED_PACKET_CONTAINS_FORBIDDEN_PUBLIC_MARKERS';
  }

  return 'OWNER_REVIEW_PACKET_READY_NOT_APPROVED';
}

function buildMarkdown({ reportDate, auditDate, status, audit, homepage, rows, markerHits }) {
  const reviewRows = rows.filter((row) => row.status.includes('OPTION')).length;
  const guardrailRows = rows.filter((row) => row.section === 'guardrail' || row.section === 'qa_before_publication').length;
  const auditRows = audit.rows?.length || 0;

  const lines = [
    `# Homepage CTA Density Review Packet - ${reportDate}`,
    '',
    `Status: ${status}`,
    '',
    `Target route: ${HOMEPAGE_URL}`,
    `Source CTA audit date: ${auditDate}`,
    '',
    'Scope: private owner/design review packet for the live homepage CTA density finding. This does not publish, edit CMS content, change homepage labels or links, alter title/H1/meta, create redirects/canonicals/noindex/sitemap/taxonomy entries, create leads, contact lawyers, invoice, charge payment, send email, use WhatsApp/TalkTo or deploy uPress.',
    '',
    '## Summary',
    '',
    `- Source audit rows: ${auditRows}`,
    `- Homepage HTTP status: ${homepage?.http_status ?? 'missing'}`,
    `- Homepage audit status: ${homepage?.status || 'missing'}`,
    `- Homepage primary CTA count: ${homepage?.primary_cta_count ?? 'missing'}`,
    `- Homepage unique primary CTA texts: ${homepage?.unique_primary_cta_texts ?? 'missing'}`,
    `- Repeated homepage CTA text groups: ${homepage?.repeated_text_groups || '-'}`,
    `- Review option rows: ${reviewRows}`,
    `- Guardrail / QA rows: ${guardrailRows}`,
    `- Forbidden internal/business-plan marker hits: ${markerHits.length}`,
    '- Public changes approved by this packet: 0',
    '',
    '## Review Rows',
    '',
    '| ID | Section | Status | Item | Evidence | Recommendation | Owner Decision Needed | Public Change Approved | Blocker |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map(
      (row) =>
        `| ${row.id} | ${row.section} | ${row.status} | ${mdCell(row.item)} | ${mdCell(row.evidence)} | ${mdCell(row.recommendation)} | ${mdCell(row.owner_decision_needed)} | ${row.public_change_approved} | ${mdCell(row.blocker)} |`,
    ),
    '',
    '## Recommended Decision Path',
    '',
    '1. Do not add more homepage CTAs until this repeated-card-label issue is reviewed visually.',
    '2. Prefer Option A if the owner wants zero immediate public risk.',
    '3. Prefer Option B only after mobile and desktop screenshots confirm the lawyer-card section feels quieter and still usable.',
    '4. Treat Option C and Option D as larger homepage product/design decisions.',
    '',
    '## Safety Statement',
    '',
    'This packet is deliberately local and private. It converts a live-audit review item into owner options, but it does not approve any public-facing change.',
  ];

  return `${lines.join('\n')}\n`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-homepage-cta-density-review-packet.mjs --reportDate=YYYY-MM-DD --auditDate=YYYY-MM-DD');
    return;
  }

  const sourceAuditPath = auditPath(args.auditDate);
  const audit = readJson(sourceAuditPath);
  const homepage = homepageRow(audit);
  const rows = buildRows(homepage);
  const markerHits = findForbiddenMarkerHits(rows);
  const status = packetStatus(homepage, markerHits);
  const outputs = outputFiles(args.reportDate);
  const columns = [
    'id',
    'section',
    'status',
    'item',
    'evidence',
    'recommendation',
    'owner_decision_needed',
    'public_change_approved',
    'blocker',
  ];

  const report = {
    reportDate: args.reportDate,
    auditDate: args.auditDate,
    status,
    targetRoute: HOMEPAGE_URL,
    sourceAuditPath: path.relative(ROOT, sourceAuditPath).replace(/\\/g, '/'),
    summary: {
      sourceAuditRows: audit.rows?.length || 0,
      homepageStatus: homepage?.status || null,
      homepageHttpStatus: homepage?.http_status || null,
      homepagePrimaryCtaCount: homepage?.primary_cta_count || null,
      homepageUniquePrimaryCtaTexts: homepage?.unique_primary_cta_texts || null,
      homepageRepeatedTextGroups: homepage?.repeated_text_groups || null,
      reviewRows: rows.filter((row) => row.status.includes('OPTION')).length,
      forbiddenPublicMarkerHits: markerHits.length,
      publicChangesApproved: 0,
    },
    homepageAuditRow: homepage || null,
    markerHits,
    rows,
  };

  writeText(outputs.projectMd, buildMarkdown({ reportDate: args.reportDate, auditDate: args.auditDate, status, audit, homepage, rows, markerHits }));
  writeText(outputs.projectCsv, toCsv(rows, columns));
  writeText(outputs.reportJson, `${JSON.stringify(report, null, 2)}\n`);
  writeText(outputs.reportCsv, toCsv(rows, columns));

  console.log(`Homepage CTA density review packet status: ${status}`);
  console.log(`Project markdown: ${path.relative(ROOT, outputs.projectMd)}`);
  console.log(`Report JSON: ${path.relative(ROOT, outputs.reportJson)}`);
}

main();
