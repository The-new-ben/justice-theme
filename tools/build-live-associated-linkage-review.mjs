import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    input: '',
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--input=')) {
      args.input = arg.slice('--input='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }

  if (!args.input) {
    args.input = path.join(ROOT, '.reports', `live-legal-help-conversion-surface-${args.reportDate}.json`);
  } else if (!path.isAbsolute(args.input)) {
    args.input = path.join(ROOT, args.input);
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `live-associated-linkage-review-${reportDate}`;
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

function routeByPath(rows) {
  return new Map(rows.map((row) => [row.path, row]));
}

function buildCandidateRows(rows) {
  const routes = routeByPath(rows);
  const candidatePairs = [
    {
      id: 'LINK-001',
      source: '/',
      target: '/lawyers/',
      suggested_anchor_he: 'חיפוש עורכי דין לפי תחום ואזור',
      placement: 'Homepage search/help section',
      user_intent: 'Visitor who starts broad and wants lawyer profiles.',
      cannibalization_risk: 'LOW',
      approval_required: 'Owner/public UX review only; no SEO metadata change.',
      owner_action: 'Approve a contextual homepage link only if it supports the existing search journey.',
    },
    {
      id: 'LINK-002',
      source: '/',
      target: '/find-lawyer-how-to-find-good-attorney/',
      suggested_anchor_he: 'איך בוחרים עורך דין מתאים',
      placement: 'Homepage guide/help section',
      user_intent: 'Visitor who is not ready to contact a lawyer and needs selection guidance.',
      cannibalization_risk: 'LOW',
      approval_required: 'Owner/public UX review only; no SEO metadata change.',
      owner_action: 'Approve a guide link if homepage flow needs one educational step before contact.',
    },
    {
      id: 'LINK-003',
      source: '/lawyers/',
      target: '/find-lawyer-how-to-find-good-attorney/',
      suggested_anchor_he: 'מה לבדוק לפני שבוחרים עורך דין',
      placement: 'Lawyer directory intro or filter-adjacent help text',
      user_intent: 'Directory visitor who needs quality checks before opening profiles.',
      cannibalization_risk: 'LOW',
      approval_required: 'Owner/public UX review only; keep directory as the profile-list page.',
      owner_action: 'Approve if the directory intro feels too transactional without a trust guide.',
    },
    {
      id: 'LINK-004',
      source: '/find-lawyer-how-to-find-good-attorney/',
      target: '/lawyers/',
      suggested_anchor_he: 'מעבר למדריך עורכי הדין',
      placement: 'End of guide after selection criteria',
      user_intent: 'Reader finished the selection guide and is ready to compare profiles.',
      cannibalization_risk: 'LOW',
      approval_required: 'Owner/public UX review only; no title/H1/canonical change.',
      owner_action: 'Approve as a conversion link after the guide, not as a replacement for the guide intent.',
    },
    {
      id: 'LINK-005',
      source: '/national-insurance-attorney/',
      target: '/bituach-leumi-appeal-guide/',
      suggested_anchor_he: 'מדריך לערעור ביטוח לאומי ובדיקת זכאות',
      placement: 'Near explanatory section before the contact CTA',
      user_intent: 'Visitor on lawyer-match page who still needs process/calc explanation.',
      cannibalization_risk: 'MEDIUM',
      approval_required: 'Owner + SEO/GSC approval; preserve lawyer-match vs guide/calculator split.',
      owner_action: 'Approve only if anchor and placement reinforce that this page is for finding help, while target is the guide/calculator.',
    },
    {
      id: 'LINK-006',
      source: '/bituach-leumi-appeal-guide/',
      target: '/national-insurance-attorney/',
      suggested_anchor_he: 'בדיקה עם עורך דין לערעור ביטוח לאומי',
      placement: 'After calculator/result or near next-step section',
      user_intent: 'Guide/calculator reader who may need professional review before deadline.',
      cannibalization_risk: 'MEDIUM',
      approval_required: 'Owner + SEO/GSC approval; preserve guide/calculator vs lawyer-match split.',
      owner_action: 'Approve as a next-step conversion link only after confirming both pages have distinct titles/H1 and SERP roles.',
    },
    {
      id: 'LINK-007',
      source: '/criminal-defense-attorney/',
      target: '/lawyers/',
      suggested_anchor_he: 'חיפוש עורכי דין פליליים במדריך',
      placement: 'Practice page lawyer-search CTA',
      user_intent: 'Criminal-law visitor ready to compare lawyer profiles.',
      cannibalization_risk: 'LOW',
      approval_required: 'Owner/public UX review; no SEO metadata change.',
      owner_action: 'Approve if the target can filter or contextually support criminal-law profile discovery.',
    },
    {
      id: 'LINK-008',
      source: '/medical-malpractice-lawyer/',
      target: '/lawyers/',
      suggested_anchor_he: 'חיפוש עורכי דין לרשלנות רפואית',
      placement: 'Practice page lawyer-search CTA',
      user_intent: 'Medical-malpractice visitor ready to compare lawyer profiles.',
      cannibalization_risk: 'LOW',
      approval_required: 'Owner/public UX review; no SEO metadata change.',
      owner_action: 'Approve if the target can filter or contextually support medical-malpractice profile discovery.',
    },
    {
      id: 'LINK-009',
      source: '/real-estate-lawyer-guide/',
      target: '/lawyers/',
      suggested_anchor_he: 'חיפוש עורכי דין מקרקעין',
      placement: 'Real-estate guide next-step section',
      user_intent: 'Real-estate reader ready for transaction/legal review.',
      cannibalization_risk: 'LOW',
      approval_required: 'Owner/public UX review; no SEO metadata change.',
      owner_action: 'Approve as a profile-discovery link if it stays secondary to the guide content.',
    },
    {
      id: 'LINK-010',
      source: '/real-estate-lawyer-guide/',
      target: 'PURCHASE_TAX_OR_SELLER_TAX_TOOL_PLACEHOLDER',
      suggested_anchor_he: 'בדיקת מס רכישה או מס שבח לפני עסקה',
      placement: 'Only after a dedicated tool URL is approved',
      user_intent: 'Real-estate reader who needs a calculator/tool before contacting a lawyer.',
      cannibalization_risk: 'HIGH',
      approval_required: 'Owner + SEO/GSC approval required; inspect existing purchase-tax/seller-tax pages first.',
      owner_action: 'Do not add this link until exact existing tool/page inventory is checked and the target URL is approved.',
    },
  ];

  return candidatePairs.map((pair) => {
    const sourceRoute = routes.get(pair.source);
    const targetRoute = routes.get(pair.target);
    const sourceVerified = sourceRoute?.status === 'VERIFIED';
    const targetVerified = pair.target.includes('PLACEHOLDER') ? false : targetRoute?.status === 'VERIFIED';
    const isApprovedForPublish = 'NO';
    const status = sourceVerified && (targetVerified || pair.target.includes('PLACEHOLDER'))
      ? 'READY_FOR_OWNER_REVIEW'
      : 'BLOCKED_ROUTE_NOT_VERIFIED';

    return {
      ...pair,
      source_role: sourceRoute?.role || '-',
      target_role: targetRoute?.role || (pair.target.includes('PLACEHOLDER') ? 'tool-url-not-approved' : '-'),
      source_verified: sourceVerified ? 'YES' : 'NO',
      target_verified: targetVerified ? 'YES' : 'NO',
      status,
      approved_for_publish: isApprovedForPublish,
      safety_rule: 'Review packet only: do not change CMS links, titles/H1/meta, URLs, redirects, canonicals/noindex, sitemap or taxonomy without approval.',
    };
  });
}

function markdownReport(rows, sourceReport, reportDate) {
  const highRisk = rows.filter((row) => row.cannibalization_risk === 'HIGH');
  const mediumRisk = rows.filter((row) => row.cannibalization_risk === 'MEDIUM');
  const readyRows = rows.filter((row) => row.status === 'READY_FOR_OWNER_REVIEW');

  const lines = [
    `# Live Associated Page Linkage Review - ${reportDate}`,
    '',
    'Status: REVIEW_PACKET_ONLY_NOT_APPROVED_FOR_PUBLISH',
    '',
    `Source report: ${path.relative(ROOT, sourceReport)}`,
    '',
    'Scope: private decision packet for associated/synonymous public pages found in the live legal-help surface audit. This converts the route QA into an owner/SEO review queue for future internal links without editing public pages.',
    '',
    'Safety: no CMS publish, database edit, internal link write, title/H1/meta change, URL change, redirect, canonical/noindex, sitemap, taxonomy, lead, lawyer, supplier, product, payment, invoice, email, WhatsApp, GSC, GA4, wp-admin or uPress action was performed.',
    '',
    '## Summary',
    '',
    `- Candidate link decisions: ${rows.length}`,
    `- Ready for owner review: ${readyRows.length}`,
    `- Medium cannibalization risk: ${mediumRisk.length}`,
    `- High cannibalization risk: ${highRisk.length}`,
    '- Approved for publish: 0',
    '',
    '## Candidate Decisions',
    '',
    '| ID | Source | Target | Risk | Suggested Anchor | Approval Required | Owner Action |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map((row) => `| ${row.id} | ${row.source} | ${row.target} | ${row.cannibalization_risk} | ${row.suggested_anchor_he} | ${row.approval_required} | ${row.owner_action} |`),
    '',
    '## Interpretation',
    '',
    '- Low-risk rows are UX/conversion candidates only; they still need owner approval before any public edit.',
    '- The Bituach Leumi cross-links are medium-risk because the two pages must keep separate intent: lawyer matching vs guide/calculator.',
    '- The real-estate tool placeholder is high-risk because purchase-tax/seller-tax style pages may already exist and must be inventoried before linking or creating anything new.',
    '- This packet is intentionally not a CMS upload, not a redirect/canonical plan and not a sitemap/taxonomy plan.',
    ''
  ];

  return lines.join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-live-associated-linkage-review.mjs [--reportDate=YYYY-MM-DD] [--input=.reports/live-legal-help-conversion-surface-YYYY-MM-DD.json]');
  process.exit(0);
}

const parsed = JSON.parse(readFileSync(args.input, 'utf8'));
const rows = buildCandidateRows(parsed.rows || []);
const outputs = outputFiles(args.reportDate);
const columns = [
  'id',
  'status',
  'source',
  'target',
  'source_role',
  'target_role',
  'source_verified',
  'target_verified',
  'cannibalization_risk',
  'suggested_anchor_he',
  'placement',
  'user_intent',
  'approval_required',
  'owner_action',
  'approved_for_publish',
  'safety_rule',
];

writeText(outputs.projectCsv, toCsv(rows, columns));
writeText(outputs.reportCsv, toCsv(rows, columns));
writeText(outputs.reportJson, JSON.stringify({ sourceReport: path.relative(ROOT, args.input), rows }, null, 2) + '\n');
writeText(outputs.projectMd, markdownReport(rows, args.input, args.reportDate));

console.table(rows.map(({ id, status, source, target, cannibalization_risk, approved_for_publish }) => ({
  id,
  status,
  source,
  target,
  cannibalization_risk,
  approved_for_publish,
})));
console.log(`Wrote ${path.relative(ROOT, outputs.projectMd)} and ${path.relative(ROOT, outputs.reportCsv)}`);
