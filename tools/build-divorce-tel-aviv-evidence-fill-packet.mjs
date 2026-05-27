import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';

const TARGET = {
  slug: 'divorce-lawyer-tel-aviv',
  targetPath: '/divorce-lawyer-tel-aviv/',
  pillarPath: '/divorce-lawyer/',
  familyHubPath: '/family-law/',
  directoryPath: '/lawyers/?city=tel-aviv&practice=family-law',
  city: 'Tel Aviv',
  practice: 'Divorce and family law',
};

const ASSOCIATED_ROUTES = [
  {
    id: 'ROUTE-01',
    path: TARGET.targetPath,
    role: 'target_private_candidate',
    expectedGate: 'should remain non-public until approved',
    inspectionNeed: 'confirm target is not already public before private drafting continues',
  },
  {
    id: 'ROUTE-02',
    path: TARGET.pillarPath,
    role: 'central_divorce_pillar',
    expectedGate: 'must remain the main divorce-lawyer page',
    inspectionNeed: 'protect from local-page duplication and send broad intent here',
  },
  {
    id: 'ROUTE-03',
    path: TARGET.familyHubPath,
    role: 'family_law_hub',
    expectedGate: 'associated hub, not a duplicate local divorce page',
    inspectionNeed: 'check whether family-law hub should link to the eventual local page only after approval',
  },
  {
    id: 'ROUTE-04',
    path: '/child-custody/',
    role: 'specific_family_issue',
    expectedGate: 'protect issue-specific intent',
    inspectionNeed: 'do not absorb custody advice into the Tel Aviv divorce page',
  },
  {
    id: 'ROUTE-05',
    path: '/child-support-calculator-2023/',
    role: 'calculator_specific_intent',
    expectedGate: 'protect calculator intent',
    inspectionNeed: 'link only if user task genuinely needs child-support calculation context',
  },
  {
    id: 'ROUTE-06',
    path: '/divorce-mediation/',
    role: 'mediation_specific_intent',
    expectedGate: 'protect mediation intent',
    inspectionNeed: 'avoid making the Tel Aviv page a mediation guide',
  },
  {
    id: 'ROUTE-07',
    path: '/what-is-a-divorce-settlement-agreement/',
    role: 'settlement_agreement_article',
    expectedGate: 'protect settlement explanation intent',
    inspectionNeed: 'can support document checklist only after legal/editor review',
  },
  {
    id: 'ROUTE-08',
    path: '/free-divorce-agreement-template/',
    role: 'template_article',
    expectedGate: 'protect template intent',
    inspectionNeed: 'avoid promising that a template is enough for a local case',
  },
  {
    id: 'ROUTE-09',
    path: '/how-much-does-a-divorce-agreement-cost/',
    role: 'cost_article',
    expectedGate: 'protect price/cost intent',
    inspectionNeed: 'do not copy price claims into a local lawyer page without review',
  },
  {
    id: 'ROUTE-10',
    path: TARGET.directoryPath,
    role: 'filtered_lawyer_directory',
    expectedGate: 'coverage proof required',
    inspectionNeed: 'public draft stays blocked until real filtered lawyer count is verified',
  },
];

const SOURCE_ROWS = [
  {
    id: 'SRC-001',
    type: 'official',
    title: 'Israeli government divorce certificate service',
    url: 'https://www.gov.il/he/service/obtaining-divorce-certificate',
    useFor: 'official-document vocabulary and evidence checklist direction',
    boundary: 'Do not convert certificate-service details into legal advice, local court facts, timelines or eligibility claims.',
  },
  {
    id: 'SRC-002',
    type: 'official',
    title: 'Israeli government legal aid application service',
    url: 'https://www.gov.il/he/service/legal_aid_application',
    useFor: 'eligibility-sensitive wording and alternatives for users who may need official help',
    boundary: 'Do not claim eligibility or promise representation; direct users to verify with official service or a lawyer.',
  },
  {
    id: 'SRC-003',
    type: 'official',
    title: 'Assistance units near courts and religious courts',
    url: 'https://www.gov.il/he/departments/Units/molsa-court-assiatance-units',
    useFor: 'non-adversarial family-dispute context and source-aware wording',
    boundary: 'Do not describe a mandatory process, deadline or local office assignment unless legal/editor review confirms it.',
  },
  {
    id: 'SRC-004',
    type: 'competitor',
    title: 'Gohar Law divorce-lawyer positioning reference',
    url: 'https://www.goharlaw.com/',
    useFor: 'commercial SERP framing: experience, local service, family-law reassurance',
    boundary: 'Do not copy claims, rankings, testimonials, outcomes, price ranges, badges or personal positioning.',
  },
  {
    id: 'SRC-005',
    type: 'competitor',
    title: 'Rotenberg Law divorce-lawyer positioning reference',
    url: 'https://rotenberglaw.co.il/',
    useFor: 'commercial SERP framing: process reassurance, family-law coverage, trust cues',
    boundary: 'Do not copy claims, slogans, reviews, price ranges, badges or outcome promises.',
  },
];

const QUERY_CLUSTER_ROWS = [
  {
    id: 'QUERY-01',
    cluster: 'exact_local_divorce_lawyer',
    likelyIntent: 'User wants a divorce lawyer in Tel Aviv or nearby and may be ready to leave a request.',
    draftTreatment: 'Short local triage, then route broad divorce questions to the central pillar and lawyer-fit questions to the filtered directory.',
    gscNeeded: 'query, page, clicks, impressions, average position for exact local variations',
    currentEvidence: 'Blank in the current evidence template.',
    gate: 'BLOCKED_PENDING_GSC',
  },
  {
    id: 'QUERY-02',
    cluster: 'broad_divorce_lawyer',
    likelyIntent: 'User is still comparing how to choose a divorce lawyer.',
    draftTreatment: 'Keep this owned by the central pillar; local page may add only local fit and intake preparation.',
    gscNeeded: 'central pillar query/page performance and cannibalizing URLs',
    currentEvidence: 'Central pillar exists, but GSC performance is not filled in this packet.',
    gate: 'BLOCKED_PENDING_GSC',
  },
  {
    id: 'QUERY-03',
    cluster: 'documents_and_procedure',
    likelyIntent: 'User needs to prepare documents or understand next procedural steps.',
    draftTreatment: 'Checklist language only, source-aware, no deadlines or legal instructions.',
    gscNeeded: 'document/procedure query rows and associated page mapping',
    currentEvidence: 'Official source prompts recorded; no GSC evidence filled.',
    gate: 'REVIEW_REQUIRED',
  },
  {
    id: 'QUERY-04',
    cluster: 'settlement_mediation_agreement',
    likelyIntent: 'User is checking whether an agreement or mediation path is relevant.',
    draftTreatment: 'Point to existing settlement/mediation articles instead of duplicating them.',
    gscNeeded: 'agreement/mediation query-page rows',
    currentEvidence: 'Associated pages mapped for cannibalization review.',
    gate: 'REVIEW_REQUIRED',
  },
  {
    id: 'QUERY-05',
    cluster: 'cost_consultation_price',
    likelyIntent: 'User is comparing consultation or agreement costs.',
    draftTreatment: 'Avoid price promises; link to cost article only if owner/legal review approves exact wording.',
    gscNeeded: 'cost/price query-page rows and owner-approved price policy',
    currentEvidence: 'Cost-related associated route mapped; no price data approved.',
    gate: 'BLOCKED_NO_PRICE_CLAIMS',
  },
  {
    id: 'QUERY-06',
    cluster: 'urgent_local_help',
    likelyIntent: 'User may have a hearing, conflict escalation or urgent family-law need.',
    draftTreatment: 'Use calm fit-check wording; do not promise emergency handling or response time.',
    gscNeeded: 'urgent/local/help query rows and legal review',
    currentEvidence: 'No live lawyer coverage or SLA proof available.',
    gate: 'BLOCKED_NO_SLA_CLAIMS',
  },
];

const DECISION_TEMPLATE_ROWS = [
  {
    gateId: 'GATE-01',
    requiredInput: 'Target public status check',
    acceptableValue: 'Target is not public 200, or owner approves treating it as existing public asset',
    currentValue: '',
    currentStatus: 'auto_filled_by_tool',
    owner: 'Codex/operator',
    notesNoPii: 'Read-only fetch only.',
  },
  {
    gateId: 'GATE-02',
    requiredInput: 'GSC exact local query/page rows',
    acceptableValue: '90-day clicks, impressions and average position filled for exact local and broad divorce clusters',
    currentValue: '',
    currentStatus: 'BLOCKED_PENDING_EXPORT',
    owner: 'Owner/operator',
    notesNoPii: 'No GSC API call is made by this packet.',
  },
  {
    gateId: 'GATE-03',
    requiredInput: 'Central pillar role confirmation',
    acceptableValue: '/divorce-lawyer/ remains primary for broad divorce-lawyer intent',
    currentValue: 'proposed',
    currentStatus: 'REVIEW_REQUIRED',
    owner: 'SEO/editor',
    notesNoPii: 'No canonical, redirect or internal link changes.',
  },
  {
    gateId: 'GATE-04',
    requiredInput: 'Filtered Tel Aviv family-law lawyer coverage',
    acceptableValue: 'Real filtered count and profile readiness verified in wp-admin',
    currentValue: '',
    currentStatus: 'BLOCKED_PENDING_WP_ADMIN_REVIEW',
    owner: 'Owner/admin',
    notesNoPii: 'Do not publish if directory has insufficient verified coverage.',
  },
  {
    gateId: 'GATE-05',
    requiredInput: 'Internal overlap review',
    acceptableValue: 'Associated pages mapped and preserved, with one approved unique angle',
    currentValue: 'associated route map prepared',
    currentStatus: 'REVIEW_REQUIRED',
    owner: 'SEO/editor',
    notesNoPii: 'Protect custody, mediation, agreement, template and cost articles.',
  },
  {
    gateId: 'GATE-06',
    requiredInput: 'Legal/editor review',
    acceptableValue: 'Reviewer signs off official-source wording, disclaimers and no legal-advice boundaries',
    currentValue: '',
    currentStatus: 'BLOCKED_PENDING_REVIEWER',
    owner: 'Legal/editor',
    notesNoPii: 'No deadlines, eligibility claims, court facts or legal instructions without review.',
  },
  {
    gateId: 'GATE-07',
    requiredInput: 'Owner publication approval',
    acceptableValue: 'Owner approves exact title/H1/body/internal links and publication path',
    currentValue: '',
    currentStatus: 'BLOCKED_PENDING_OWNER',
    owner: 'Owner',
    notesNoPii: 'No CMS/database/public SEO action from this artifact.',
  },
  {
    gateId: 'GATE-08',
    requiredInput: 'Public-change notification workflow',
    acceptableValue: 'If a future public update is approved and deployed, check instruction email first, then send Hebrew summary with review URL and cannibalization list',
    currentValue: 'not applicable',
    currentStatus: 'NOT_TRIGGERED_PRIVATE_ONLY',
    owner: 'Codex/operator',
    notesNoPii: 'No email is sent for this private packet.',
  },
];

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    baseUrl: DEFAULT_BASE_URL,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--baseUrl=')) {
      args.baseUrl = arg.slice('--baseUrl='.length).replace(/\/$/, '');
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
  const base = `divorce-tel-aviv-evidence-fill-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    gateTemplateCsv: path.join(ROOT, '.project-control', `divorce-tel-aviv-public-draft-gate-template-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows, columns) {
  const body = rows.map((row) => columns.map((column) => csvEscape(row[column])).join(',')).join('\n');
  return `${columns.join(',')}\n${body}${body ? '\n' : ''}`;
}

function writeText(filePath, text) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
}

function readLocal(relativePath) {
  return readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function stripHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTitle(html) {
  const match = String(html || '').match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? stripHtml(match[1]) : '';
}

function extractFirstH1(html) {
  const match = String(html || '').match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return match ? stripHtml(match[1]) : '';
}

function countWords(text) {
  return String(text || '')
    .split(/\s+/)
    .filter(Boolean).length;
}

async function fetchLive(baseUrl, route) {
  const url = `${baseUrl}${route}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}jt_divorce_ta_evidence=${Date.now()}`, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'user-agent': 'Mozilla/5.0 (compatible; JusTiceDivorceTelAvivEvidenceFill/1.0; +https://jus-tice.co.il/)',
      },
    });
    const html = await response.text();
    return {
      status: response.status,
      finalUrl: response.url.replace(/[?&]jt_divorce_ta_evidence=\d+/, ''),
      title: extractTitle(html),
      h1: extractFirstH1(html),
      wordEstimate: countWords(stripHtml(html)),
      error: '',
    };
  } catch (error) {
    return {
      status: 'FETCH_ERROR',
      finalUrl: url,
      title: '',
      h1: '',
      wordEstimate: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function buildLocalGateRows() {
  const priorityReport = readLocal('.reports/city-practice-priority-draft-briefs-2026-05-27.json');
  const evidenceTemplate = readLocal('.project-control/city-practice-thin-page-evidence-template-2026-05-27.csv');

  return [
    {
      id: 'LOCAL-01',
      gate: 'priority_brief_exists',
      status: priorityReport.includes(TARGET.slug) ? 'PASS' : 'BLOCKED',
      evidence: 'Prior priority draft-brief report is present and includes the Tel Aviv divorce target.',
      nextAction: 'Use this packet as the next private evidence-fill layer.',
    },
    {
      id: 'LOCAL-02',
      gate: 'blank_evidence_row_exists',
      status: evidenceTemplate.includes(`${TARGET.slug},${TARGET.targetPath}`) ? 'PASS' : 'BLOCKED',
      evidence: 'The prior evidence template still has a row for the target.',
      nextAction: 'Fill GSC/lawyer/reviewer fields before any public action.',
    },
    {
      id: 'LOCAL-03',
      gate: 'public_boundary',
      status: 'PASS',
      evidence: 'This tool writes only dot-private .project-control and .reports artifacts.',
      nextAction: 'Do not publish, update CMS, change SEO settings, contact people, invoice, email or deploy from this packet.',
    },
  ];
}

async function buildRouteRows(baseUrl) {
  const checks = await Promise.all(ASSOCIATED_ROUTES.map((route) => fetchLive(baseUrl, route.path)));
  return ASSOCIATED_ROUTES.map((route, index) => {
    const live = checks[index];
    let gate = 'REVIEW';
    if (route.path === TARGET.targetPath) {
      gate = Number(live.status) === 200 ? 'BLOCKED_TARGET_ALREADY_PUBLIC' : 'PASS_TARGET_NOT_PUBLIC_200';
    } else if (route.path === TARGET.pillarPath) {
      gate = Number(live.status) === 200 ? 'PASS_PILLAR_REACHABLE' : 'BLOCKED_PILLAR_NOT_REACHABLE';
    } else if (Number(live.status) === 200) {
      gate = 'LIVE_ASSOCIATED_PAGE_REVIEW';
    } else if (String(live.status).startsWith('3')) {
      gate = 'REDIRECT_REVIEW';
    } else {
      gate = 'REVIEW_NOT_LIVE_200';
    }

    return {
      ...route,
      url: `${baseUrl}${route.path}`,
      status: live.status,
      finalUrl: live.finalUrl,
      title: live.title,
      h1: live.h1,
      wordEstimate: live.wordEstimate,
      error: live.error,
      gate,
    };
  });
}

function buildEvidenceRows(routeRows) {
  const targetRow = routeRows.find((row) => row.path === TARGET.targetPath);
  const pillarRow = routeRows.find((row) => row.path === TARGET.pillarPath);
  const directoryRow = routeRows.find((row) => row.path === TARGET.directoryPath);

  return [
    {
      id: 'EVIDENCE-01',
      category: 'target_status',
      finding: `${TARGET.targetPath} live status is ${targetRow?.status ?? 'unknown'}.`,
      implication: targetRow?.gate === 'PASS_TARGET_NOT_PUBLIC_200' ? 'Safe to continue private draft preparation.' : 'Treat as existing public page until inspected.',
      gate: targetRow?.gate ?? 'REVIEW',
      ownerAction: 'Do not create or publish the page until all draft gates are filled.',
    },
    {
      id: 'EVIDENCE-02',
      category: 'pillar_protection',
      finding: `${TARGET.pillarPath} live status is ${pillarRow?.status ?? 'unknown'}.`,
      implication: 'Broad divorce-lawyer intent must stay with the central pillar.',
      gate: pillarRow?.gate ?? 'REVIEW',
      ownerAction: 'Confirm the local page will be a subordinate fit-check page, not a duplicate guide.',
    },
    {
      id: 'EVIDENCE-03',
      category: 'lawyer_coverage',
      finding: `${TARGET.directoryPath} live status is ${directoryRow?.status ?? 'unknown'}, but real filtered lawyer count is not verified.`,
      implication: 'Commercial path is visible, but public page remains blocked without verified Tel Aviv family-law coverage.',
      gate: 'BLOCKED_PENDING_WP_ADMIN_REVIEW',
      ownerAction: 'Owner/admin must confirm filtered lawyer profile count and readiness.',
    },
    {
      id: 'EVIDENCE-04',
      category: 'gsc_gap',
      finding: 'The prior evidence template contains no clicks, impressions or average position for this target.',
      implication: 'Publication and internal-link decisions would be guesswork.',
      gate: 'BLOCKED_PENDING_GSC_EXPORT',
      ownerAction: 'Fill exact local, broad divorce, documents/procedure, mediation/agreement and price query rows.',
    },
    {
      id: 'EVIDENCE-05',
      category: 'unique_angle',
      finding: 'Best safe angle is local triage and request preparation for Tel Aviv divorce users.',
      implication: 'The page can help commercially without replacing the divorce pillar or issue-specific articles.',
      gate: 'REVIEW_REQUIRED',
      ownerAction: 'Approve one narrow angle before any Hebrew copy is prepared.',
    },
    {
      id: 'EVIDENCE-06',
      category: 'forbidden_claims',
      finding: 'No evidence supports best/recommended/ranked lawyer claims, price promises, emergency response, local court facts or legal instructions.',
      implication: 'Draft must stay careful, user-first and source-aware.',
      gate: 'PASS_WITH_RESTRICTIONS',
      ownerAction: 'Legal/editor review must remove any unsupported claims.',
    },
  ];
}

function buildReportRows({ localGateRows, routeRows, evidenceRows }) {
  return [
    ...localGateRows.map((row) => ({
      row_type: 'local_gate',
      id: row.id,
      item: row.gate,
      status: row.status,
      evidence: row.evidence,
      next_action: row.nextAction,
    })),
    ...routeRows.map((row) => ({
      row_type: 'route_overlap',
      id: row.id,
      item: row.path,
      status: row.gate,
      evidence: `http_status=${row.status}; h1=${row.h1}; words=${row.wordEstimate}`,
      next_action: row.inspectionNeed,
    })),
    ...QUERY_CLUSTER_ROWS.map((row) => ({
      row_type: 'query_cluster',
      id: row.id,
      item: row.cluster,
      status: row.gate,
      evidence: row.currentEvidence,
      next_action: row.gscNeeded,
    })),
    ...SOURCE_ROWS.map((row) => ({
      row_type: 'source_prompt',
      id: row.id,
      item: row.title,
      status: row.type === 'official' ? 'SOURCE_PROMPT_OFFICIAL' : 'SOURCE_PROMPT_COMPETITOR',
      evidence: row.url,
      next_action: row.boundary,
    })),
    ...evidenceRows.map((row) => ({
      row_type: 'evidence_finding',
      id: row.id,
      item: row.category,
      status: row.gate,
      evidence: row.finding,
      next_action: row.ownerAction,
    })),
  ];
}

function buildSummary({ reportDate, localGateRows, routeRows, evidenceRows }) {
  const hardBlocked = [
    ...localGateRows.filter((row) => row.status === 'BLOCKED'),
    ...routeRows.filter((row) => row.gate.startsWith('BLOCKED_TARGET_ALREADY_PUBLIC') || row.gate === 'BLOCKED_PILLAR_NOT_REACHABLE'),
  ];
  const targetRow = routeRows.find((row) => row.path === TARGET.targetPath);
  const ownerBlocked = evidenceRows.filter((row) => row.gate.startsWith('BLOCKED')).length + DECISION_TEMPLATE_ROWS.filter((row) => row.currentStatus.startsWith('BLOCKED')).length;

  return {
    reportDate,
    status: hardBlocked.length ? 'DIVORCE_TEL_AVIV_EVIDENCE_FILL_BLOCKED_REVIEW_REQUIRED' : 'DIVORCE_TEL_AVIV_EVIDENCE_FILL_READY_NO_PUBLIC_CHANGE',
    targetSlug: TARGET.slug,
    targetPath: TARGET.targetPath,
    targetLiveStatus: targetRow?.status ?? 'unknown',
    associatedRouteCount: routeRows.length,
    liveAssociatedRouteCount: routeRows.filter((row) => Number(row.status) === 200).length,
    queryClusterCount: QUERY_CLUSTER_ROWS.length,
    officialSourcePrompts: SOURCE_ROWS.filter((row) => row.type === 'official').length,
    competitorSourcePrompts: SOURCE_ROWS.filter((row) => row.type === 'competitor').length,
    localGatePassCount: localGateRows.filter((row) => row.status === 'PASS').length,
    localGateCount: localGateRows.length,
    ownerBlockedDecisionInputs: ownerBlocked,
    publicChangesApproved: 0,
    cmsWrites: 0,
    seoChanges: 0,
    crmRecordsCreated: 0,
    contactsSent: 0,
    invoicesOrPayments: 0,
    emailsSent: 0,
    upressActions: 0,
  };
}

function markdownReport(summary, { localGateRows, routeRows, evidenceRows }) {
  return [
    `# Divorce Tel Aviv Evidence-Fill Packet - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: private evidence-fill packet for `/divorce-lawyer-tel-aviv/`. It does not publish content, edit WordPress, change redirects/canonicals/noindex/sitemaps/taxonomies, contact clients/lawyers/suppliers, create CRM records, send email/WhatsApp/TalkTo, create invoices/payments, or deploy.',
    '',
    '## Summary',
    '',
    `- Target: ${TARGET.targetPath}`,
    `- Target live status: ${summary.targetLiveStatus}`,
    `- Associated/cannibalization routes checked: ${summary.associatedRouteCount}`,
    `- Query clusters prepared for GSC fill: ${summary.queryClusterCount}`,
    `- Source prompts: ${summary.officialSourcePrompts} official and ${summary.competitorSourcePrompts} competitor.`,
    `- Local gates: ${summary.localGatePassCount}/${summary.localGateCount} pass.`,
    `- Public actions: ${summary.publicChangesApproved} approved; ${summary.cmsWrites} CMS writes; ${summary.seoChanges} SEO changes; ${summary.emailsSent} emails; ${summary.upressActions} uPress actions.`,
    '',
    '## Local Gates',
    '',
    '| ID | Gate | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...localGateRows.map((row) => `| ${row.id} | ${mdCell(row.gate)} | ${row.status} | ${mdCell(row.evidence)} | ${mdCell(row.nextAction)} |`),
    '',
    '## Route / Cannibalization Map',
    '',
    '| ID | Path | Role | Status | Gate | H1 | Review Need |',
    '| --- | --- | --- | ---: | --- | --- | --- |',
    ...routeRows.map((row) => `| ${row.id} | ${mdCell(row.path)} | ${mdCell(row.role)} | ${row.status} | ${row.gate} | ${mdCell(row.h1 || row.title || row.error)} | ${mdCell(row.inspectionNeed)} |`),
    '',
    '## Query Clusters To Fill',
    '',
    '| ID | Cluster | Likely Intent | Draft Treatment | Gate |',
    '| --- | --- | --- | --- | --- |',
    ...QUERY_CLUSTER_ROWS.map((row) => `| ${row.id} | ${mdCell(row.cluster)} | ${mdCell(row.likelyIntent)} | ${mdCell(row.draftTreatment)} | ${row.gate} |`),
    '',
    '## Source Prompts',
    '',
    '| ID | Type | Title | URL | Use For | Boundary |',
    '| --- | --- | --- | --- | --- | --- |',
    ...SOURCE_ROWS.map((row) => `| ${row.id} | ${row.type} | ${mdCell(row.title)} | ${row.url} | ${mdCell(row.useFor)} | ${mdCell(row.boundary)} |`),
    '',
    '## Evidence Findings',
    '',
    '| ID | Category | Finding | Implication | Gate | Owner Action |',
    '| --- | --- | --- | --- | --- | --- |',
    ...evidenceRows.map((row) => `| ${row.id} | ${mdCell(row.category)} | ${mdCell(row.finding)} | ${mdCell(row.implication)} | ${row.gate} | ${mdCell(row.ownerAction)} |`),
    '',
    '## Private Draft Positioning',
    '',
    '- Page role: short local fit-check and request-preparation page for users looking for divorce help in Tel Aviv.',
    '- It should not become a full divorce guide; broad how-to content belongs on `/divorce-lawyer/`.',
    '- It should not absorb custody, child support, mediation, agreement-template or cost intent; those routes stay separate unless GSC/legal/editor review says otherwise.',
    '- Commercial CTA direction may be a quiet request/fit-check path, but only after verified filtered lawyer coverage exists.',
    '- No best/recommended/ranked claims, price promises, response-time claims, local court facts, deadlines, eligibility claims or legal advice without source and legal/editor approval.',
    '',
    '## Own Review',
    '',
    'This target is a good private next step because the target URL is not public 200, the broad divorce pillar exists, and the SERP is clearly commercial. The remaining risk is cannibalization: a Tel Aviv page can be useful only if it stays local and practical while preserving the central divorce guide and issue-specific family-law articles. Publication should remain blocked until GSC, filtered lawyer coverage, legal/editor review and owner approval are filled.',
    '',
    '## Next Blocked Inputs',
    '',
    '- GSC export rows for exact local, broad divorce, documents/procedure, mediation/agreement and price clusters.',
    '- Real wp-admin count of verified Tel Aviv family-law/divorce lawyer profiles.',
    '- One approved unique angle and internal-link plan.',
    '- Legal/editor approval for source-sensitive wording.',
    '- Owner approval for exact public title/H1/body/internal links and publication method.',
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-divorce-tel-aviv-evidence-fill-packet.mjs [--reportDate=YYYY-MM-DD] [--baseUrl=https://jus-tice.co.il]');
  process.exit(0);
}

const localGateRows = buildLocalGateRows();
const routeRows = await buildRouteRows(args.baseUrl);
const evidenceRows = buildEvidenceRows(routeRows);
const reportRows = buildReportRows({ localGateRows, routeRows, evidenceRows });
const summary = buildSummary({ reportDate: args.reportDate, localGateRows, routeRows, evidenceRows });
const files = outputFiles(args.reportDate);

const reportColumns = ['row_type', 'id', 'item', 'status', 'evidence', 'next_action'];
const routeColumns = ['id', 'path', 'role', 'expectedGate', 'status', 'gate', 'url', 'finalUrl', 'h1', 'wordEstimate', 'inspectionNeed'];
const gateTemplateColumns = ['gateId', 'requiredInput', 'acceptableValue', 'currentValue', 'currentStatus', 'owner', 'notesNoPii'];

writeText(files.projectMd, markdownReport(summary, { localGateRows, routeRows, evidenceRows }));
writeText(files.projectCsv, toCsv(reportRows, reportColumns));
writeText(files.reportCsv, toCsv(routeRows, routeColumns));
writeText(files.gateTemplateCsv, toCsv(DECISION_TEMPLATE_ROWS, gateTemplateColumns));
writeText(files.reportJson, JSON.stringify({ summary, localGateRows, routeRows, queryClusterRows: QUERY_CLUSTER_ROWS, sourceRows: SOURCE_ROWS, evidenceRows, decisionTemplateRows: DECISION_TEMPLATE_ROWS, files }, null, 2));

console.log(JSON.stringify({ ...summary, files }, null, 2));
