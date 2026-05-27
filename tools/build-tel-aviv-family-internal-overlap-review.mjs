import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_SOURCE_DATE = DEFAULT_REPORT_DATE;
const TARGET_SLUG = 'divorce-lawyer-tel-aviv';

const ROLE_POLICIES = {
  target_private_candidate: {
    decision: 'KEEP_PRIVATE_DRAFT_ONLY',
    overlapRisk: 'none_while_404',
    allowedRelationship: 'No public route until owner/SEO/legal approval.',
    protectedIntent: 'future local fit-check and preparation page only',
  },
  central_divorce_pillar: {
    decision: 'PRESERVE_AS_PRIMARY_PILLAR',
    overlapRisk: 'high_if_local_page_repeats_broad_guide',
    allowedRelationship: 'Local page may link to this as the main divorce guide; broad how-to-choose content stays here.',
    protectedIntent: 'broad divorce-lawyer guidance, experience, price and decision questions',
  },
  family_law_hub: {
    decision: 'PRESERVE_AS_FAMILY_HUB',
    overlapRisk: 'medium_if_local_page_becomes_family_hub',
    allowedRelationship: 'Potential supporting link only after approval; do not duplicate family-law overview.',
    protectedIntent: 'general family-law category and related family disputes',
  },
  specific_family_issue: {
    decision: 'PROTECT_ISSUE_SPECIFIC_PAGE',
    overlapRisk: 'medium_if_local_page_adds_issue_advice',
    allowedRelationship: 'Mention only as a possible related topic; link only if legal/editor review approves.',
    protectedIntent: 'custody or other specific family-law issue intent',
  },
  calculator_specific_intent: {
    decision: 'PROTECT_CALCULATOR_INTENT',
    overlapRisk: 'high_if_local_page_adds_calculator_or_formula_claims',
    allowedRelationship: 'Do not summarize calculation logic; link later only if the user task genuinely needs it.',
    protectedIntent: 'child-support calculation intent',
  },
  mediation_specific_intent: {
    decision: 'PROTECT_MEDIATION_INTENT',
    overlapRisk: 'medium_if_local_page_becomes_mediation_guide',
    allowedRelationship: 'Do not explain mediation process beyond a review-only related-page pointer.',
    protectedIntent: 'divorce mediation guide intent',
  },
  settlement_agreement_article: {
    decision: 'PROTECT_SETTLEMENT_EXPLANATION',
    overlapRisk: 'medium_if_local_page_explains_agreement_terms',
    allowedRelationship: 'May inform the document checklist after legal/editor review; avoid agreement drafting advice.',
    protectedIntent: 'settlement agreement explanation intent',
  },
  template_article: {
    decision: 'PROTECT_TEMPLATE_INTENT',
    overlapRisk: 'high_if_local_page_promises_template_suffices',
    allowedRelationship: 'Do not imply template is enough; link only after owner/legal approval.',
    protectedIntent: 'free divorce agreement template intent',
  },
  cost_article: {
    decision: 'PROTECT_COST_INTENT',
    overlapRisk: 'high_if_local_page_adds_prices',
    allowedRelationship: 'No price claims; link only if owner/legal approves exact cost wording.',
    protectedIntent: 'divorce agreement cost and price comparison intent',
  },
  filtered_lawyer_directory: {
    decision: 'USE_CANONICAL_AREA_DIRECTORY_ONLY',
    overlapRisk: 'low_if_used_as_directory_path',
    allowedRelationship: 'Use as canonical filtered lawyer path in private planning only.',
    protectedIntent: 'lawyer directory filtering for Tel Aviv family law',
  },
  unsupported_directory_alias: {
    decision: 'EXCLUDE_FROM_DRAFT_LINK_PLAN',
    overlapRisk: 'high_if_used_as_coverage_proof',
    allowedRelationship: 'QA warning only; do not use in draft or public internal links.',
    protectedIntent: 'none; unsupported alias is city-only/generic in current checks',
  },
};

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
  const base = `tel-aviv-family-internal-overlap-review-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    editorChecklistCsv: path.join(ROOT, '.project-control', `tel-aviv-family-editor-overlap-checklist-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function readJson(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Missing required source report: ${relativePath}`);
  }
  return JSON.parse(readFileSync(fullPath, 'utf8'));
}

function readText(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Missing required source file: ${relativePath}`);
  }
  return readFileSync(fullPath, 'utf8');
}

function writeText(filePath, text) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(value);
      value = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        index += 1;
      }
      row.push(value);
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      value = '';
      continue;
    }

    value += char;
  }

  if (value.length || row.length) {
    row.push(value);
    if (row.some((cell) => cell.length > 0)) {
      rows.push(row);
    }
  }

  const [header = [], ...records] = rows;
  return records.map((record) => Object.fromEntries(header.map((name, index) => [name, record[index] || ''])));
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

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function normalizePath(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  let pathname = text;
  try {
    pathname = new URL(text).pathname;
  } catch {
    pathname = text.split('?')[0];
  }
  return `/${pathname.replace(/^\/+|\/+$/g, '')}/`.replace('//', '/').toLowerCase();
}

function normalizeUrlForCompare(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  try {
    const url = new URL(text);
    return `${url.origin}${url.pathname}`.replace(/\/$/, '').toLowerCase();
  } catch {
    return normalizePath(text).replace(/\/$/, '').toLowerCase();
  }
}

function buildOverlapRows({ routeRows, urlRows, linkRows }) {
  const clusterPathSet = new Set(routeRows.map((row) => normalizePath(row.path)));
  return routeRows.map((route) => {
    const policy = ROLE_POLICIES[route.role] || {
      decision: 'REVIEW_MANUALLY',
      overlapRisk: 'unknown',
      allowedRelationship: 'Manual SEO/editor review required.',
      protectedIntent: 'unknown',
    };
    const normalizedPath = normalizePath(route.path);
    const exportMatches = urlRows.filter((row) => normalizePath(row.current_url) === normalizedPath || normalizePath(row.current_slug) === normalizedPath);
    const routeCompareUrl = normalizeUrlForCompare(route.url);
    const incomingClusterLinks = linkRows.filter((row) => {
      const targetCompareUrl = normalizeUrlForCompare(row.target_url);
      return targetCompareUrl === routeCompareUrl || normalizePath(row.target_url) === normalizedPath;
    });
    const outgoingClusterLinks = linkRows.filter((row) => {
      const sourceCompareUrl = normalizeUrlForCompare(row.source_url);
      const sourceMatches = sourceCompareUrl === routeCompareUrl || normalizePath(row.source_url) === normalizedPath;
      return sourceMatches && clusterPathSet.has(normalizePath(row.target_url));
    });

    return {
      id: route.id,
      path: route.path,
      role: route.role,
      status: route.status,
      gate: route.gate,
      title: route.title,
      h1: route.h1,
      word_estimate: route.wordEstimate,
      export_match_count: exportMatches.length,
      incoming_internal_link_count: incomingClusterLinks.length,
      outgoing_cluster_link_count: outgoingClusterLinks.length,
      overlap_risk: policy.overlapRisk,
      decision: policy.decision,
      protected_intent: policy.protectedIntent,
      allowed_relationship: policy.allowedRelationship,
      editor_instruction: route.inspectionNeed,
      public_action_approved: 'no',
    };
  });
}

function buildChecklistRows(overlapRows) {
  return overlapRows.map((row) => ({
    path: row.path,
    role: row.role,
    editor_decision: row.decision,
    keep_out_of_tel_aviv_page: row.protected_intent,
    allowed_use: row.allowed_relationship,
    owner_approved: 'no',
    legal_editor_approved: 'no',
    notes_no_pii: '',
  }));
}

function buildGates({ draftReport, evidenceReport, overlapRows, urlRows, linkRows }) {
  const target = overlapRows.find((row) => row.role === 'target_private_candidate');
  const pillar = overlapRows.find((row) => row.role === 'central_divorce_pillar');
  const highRiskRows = overlapRows.filter((row) => row.overlap_risk.startsWith('high'));
  const mappedLiveRows = overlapRows.filter((row) => Number(row.status) === 200);
  return [
    {
      id: 'TAO-GATE-01',
      gate: 'source_packets_available',
      status:
        draftReport.status === 'TEL_AVIV_FAMILY_LOCAL_DRAFT_PACKET_READY_FOR_PRIVATE_EDITOR_REVIEW_NO_PUBLIC_CHANGE' &&
        evidenceReport.summary?.status === 'DIVORCE_TEL_AVIV_EVIDENCE_FILL_READY_NO_PUBLIC_CHANGE'
          ? 'PASS'
          : 'REVIEW',
      evidence: `Draft packet: ${draftReport.status}; evidence packet: ${evidenceReport.summary?.status}.`,
      next_action: 'Use this as an internal overlap layer only.',
    },
    {
      id: 'TAO-GATE-02',
      gate: 'target_still_private',
      status: Number(target?.status) === 404 ? 'PASS' : 'BLOCKED',
      evidence: `${target?.path || 'target'} live status is ${target?.status || 'missing'} with gate ${target?.gate || 'missing'}.`,
      next_action: 'Do not create or publish the local URL from this review.',
    },
    {
      id: 'TAO-GATE-03',
      gate: 'primary_pillar_preserved',
      status: Number(pillar?.status) === 200 && pillar?.decision === 'PRESERVE_AS_PRIMARY_PILLAR' ? 'PASS' : 'BLOCKED',
      evidence: `${pillar?.path || 'pillar'} status ${pillar?.status || 'missing'}; decision ${pillar?.decision || 'missing'}.`,
      next_action: 'Keep broad divorce-lawyer intent on the pillar.',
    },
    {
      id: 'TAO-GATE-04',
      gate: 'associated_routes_mapped',
      status: overlapRows.length >= 11 && mappedLiveRows.length >= 9 ? 'PASS' : 'REVIEW',
      evidence: `${overlapRows.length} associated route(s) mapped; ${mappedLiveRows.length} live 200 route(s) need preservation rules.`,
      next_action: 'Use the table to prevent the local page from absorbing issue, cost, mediation or template intent.',
    },
    {
      id: 'TAO-GATE-05',
      gate: 'export_snapshots_available',
      status: urlRows.length > 0 && linkRows.length > 0 ? 'PASS' : 'REVIEW',
      evidence: `${urlRows.length} URL export row(s) and ${linkRows.length} internal-link export row(s) available.`,
      next_action: 'Refresh exports before publication review if the site changes.',
    },
    {
      id: 'TAO-GATE-06',
      gate: 'high_risk_overlap_marked_protected',
      status: highRiskRows.every((row) => row.decision.startsWith('PROTECT') || row.decision.startsWith('PRESERVE') || row.decision.startsWith('EXCLUDE')) ? 'PASS' : 'BLOCKED',
      evidence: `${highRiskRows.length} high-risk overlap route(s) are marked with protect/preserve/exclude decisions.`,
      next_action: 'Do not include price, calculator, template or broad pillar content in the local draft.',
    },
    {
      id: 'TAO-GATE-07',
      gate: 'gsc_evidence_still_required',
      status: 'REVIEW',
      evidence: 'The source evidence packet still has GSC rows blank; this review fills internal overlap, not search performance.',
      next_action: 'Owner/operator should provide GSC query/page rows before public approval.',
    },
    {
      id: 'TAO-GATE-08',
      gate: 'no_public_or_live_action_authorized',
      status:
        draftReport.publicChangesApproved === 0 &&
        draftReport.cmsWritesApproved === 0 &&
        draftReport.seoSettingsChanged === 0 &&
        draftReport.redirectsOrCanonicalsChanged === 0 &&
        draftReport.crmRecordsCreated === 0 &&
        draftReport.leadOrLawyerContactActions === 0 &&
        draftReport.invoicesOrPaymentsCreated === 0 &&
        draftReport.emailsSent === 0 &&
        draftReport.upressDeploymentRequired === false
          ? 'PASS'
          : 'BLOCKED',
      evidence: 'Draft packet has 0 public/CMS/SEO/CRM/contact/payment/email approvals and no uPress requirement.',
      next_action: 'Keep this review private until explicit publication approval exists.',
    },
  ];
}

function buildMarkdown({ reportDate, sourceDate, status, gates, overlapRows }) {
  return [
    `# Tel Aviv Family Internal Overlap Review - ${reportDate}`,
    '',
    `Status: ${status}`,
    `Source date: ${sourceDate}`,
    '',
    'Scope: private anti-cannibalization review for `/divorce-lawyer-tel-aviv/`. This does not create or publish a route, edit CMS, change title/H1/meta/body/internal links, alter redirects/canonicals/noindex/sitemap/taxonomies, contact anyone, create CRM records, invoice, charge, email, or deploy.',
    '',
    '## Gates',
    '',
    '| ID | Gate | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...gates.map((gate) => `| ${gate.id} | ${mdCell(gate.gate)} | ${gate.status} | ${mdCell(gate.evidence)} | ${mdCell(gate.next_action)} |`),
    '',
    '## Overlap Decisions',
    '',
    '| Route | Role | Live | Risk | Decision | Protected Intent | Allowed Relationship |',
    '| --- | --- | ---: | --- | --- | --- | --- |',
    ...overlapRows.map(
      (row) =>
        `| ${row.path} | ${row.role} | ${row.status} | ${mdCell(row.overlap_risk)} | ${mdCell(row.decision)} | ${mdCell(row.protected_intent)} | ${mdCell(row.allowed_relationship)} |`,
    ),
    '',
    '## Editor Meaning',
    '',
    'The Tel Aviv local page may only cover local fit-check and preparation intent. Broad divorce-lawyer guidance stays on `/divorce-lawyer/`; general family-law overview stays on `/family-law/`; custody, child support, mediation, settlement agreement, template and cost intents stay with their existing pages. GSC evidence, legal/editor approval and owner approval remain required before any public route or CMS work.',
    '',
  ].join('\n');
}

function printHelp() {
  console.log('Usage: node tools/build-tel-aviv-family-internal-overlap-review.mjs [--reportDate=YYYY-MM-DD] [--sourceDate=YYYY-MM-DD]');
}

function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  const files = outputFiles(args.reportDate);
  const draftReport = readJson(`.reports/tel-aviv-family-local-draft-packet-${args.sourceDate}.json`);
  const evidenceReport = readJson(`.reports/divorce-tel-aviv-evidence-fill-packet-${args.sourceDate}.json`);
  const urlRows = parseCsv(readText('.project-control/exports/all-url-export.csv'));
  const linkRows = parseCsv(readText('.project-control/exports/all-internal-links-export.csv'));
  const routeRows = evidenceReport.routeRows || [];
  const overlapRows = buildOverlapRows({ routeRows, urlRows, linkRows });
  const checklistRows = buildChecklistRows(overlapRows);
  const gates = buildGates({ draftReport, evidenceReport, overlapRows, urlRows, linkRows });
  const blockedGateCount = gates.filter((gate) => gate.status === 'BLOCKED').length;
  const reviewGateCount = gates.filter((gate) => gate.status === 'REVIEW').length;
  const status = blockedGateCount
    ? 'TEL_AVIV_FAMILY_INTERNAL_OVERLAP_BLOCKED_NO_PUBLIC_CHANGE'
    : reviewGateCount
      ? 'TEL_AVIV_FAMILY_INTERNAL_OVERLAP_READY_WITH_GSC_REVIEW_NO_PUBLIC_CHANGE'
      : 'TEL_AVIV_FAMILY_INTERNAL_OVERLAP_READY_NO_PUBLIC_CHANGE';

  const columns = [
    'id',
    'path',
    'role',
    'status',
    'gate',
    'title',
    'h1',
    'word_estimate',
    'export_match_count',
    'incoming_internal_link_count',
    'outgoing_cluster_link_count',
    'overlap_risk',
    'decision',
    'protected_intent',
    'allowed_relationship',
    'editor_instruction',
    'public_action_approved',
  ];

  const report = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    targetSlug: TARGET_SLUG,
    routeCount: overlapRows.length,
    liveRouteCount: overlapRows.filter((row) => Number(row.status) === 200).length,
    highRiskOverlapCount: overlapRows.filter((row) => row.overlap_risk.startsWith('high')).length,
    gateCount: gates.length,
    passGateCount: gates.filter((gate) => gate.status === 'PASS').length,
    reviewGateCount,
    blockedGateCount,
    urlExportRowCount: urlRows.length,
    internalLinkExportRowCount: linkRows.length,
    publicChangesApproved: 0,
    cmsWritesApproved: 0,
    seoSettingsChanged: 0,
    redirectsOrCanonicalsChanged: 0,
    crmRecordsCreated: 0,
    leadOrLawyerContactActions: 0,
    invoicesOrPaymentsCreated: 0,
    emailsSent: 0,
    upressDeploymentRequired: false,
    gates,
    overlapRows,
    checklistRows,
    files: Object.fromEntries(Object.entries(files).map(([key, value]) => [key, path.relative(ROOT, value).replace(/\\/g, '/')])),
  };

  writeText(files.projectMd, buildMarkdown({ reportDate: args.reportDate, sourceDate: args.sourceDate, status, gates, overlapRows }));
  writeText(files.projectCsv, toCsv(overlapRows, columns));
  writeText(files.editorChecklistCsv, toCsv(checklistRows, Object.keys(checklistRows[0] || {})));
  writeText(files.reportJson, `${JSON.stringify(report, null, 2)}\n`);
  writeText(files.reportCsv, toCsv(overlapRows, columns));

  console.log(
    JSON.stringify(
      {
        reportDate: report.reportDate,
        sourceDate: report.sourceDate,
        status: report.status,
        targetSlug: report.targetSlug,
        routeCount: report.routeCount,
        liveRouteCount: report.liveRouteCount,
        highRiskOverlapCount: report.highRiskOverlapCount,
        passGateCount: report.passGateCount,
        reviewGateCount: report.reviewGateCount,
        blockedGateCount: report.blockedGateCount,
        publicChangesApproved: report.publicChangesApproved,
        cmsWritesApproved: report.cmsWritesApproved,
        crmRecordsCreated: report.crmRecordsCreated,
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
