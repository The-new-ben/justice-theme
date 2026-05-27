import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const TIMEOUT_MS = Number(process.env.JUSTICE_FETCH_TIMEOUT_MS || 18000);

const ownRoutes = [
  {
    id: 'OWN-01',
    path: '/criminal-lawyer-jerusalem/',
    role: 'live_target',
    expectedRole: 'local/practice page for legal-help seekers in Jerusalem',
    riskNote: 'Already live; inspect before any public update.',
  },
  {
    id: 'OWN-02',
    path: '/criminal-lawyer/',
    role: 'declared_pillar',
    expectedRole: 'central criminal-lawyer pillar from draft packet',
    riskNote: 'If weak or redirected, local page may compete with its intended parent.',
  },
  {
    id: 'OWN-03',
    path: '/practice-areas/criminal-law/',
    role: 'practice_archive_or_topic',
    expectedRole: 'criminal law topic/archive landing surface',
    riskNote: 'May be the actual live destination behind the declared pillar.',
  },
  {
    id: 'OWN-04',
    path: '/lawyers/?city=jerusalem&practice=criminal-law',
    role: 'filtered_directory',
    expectedRole: 'conversion path to matching lawyers if supply exists',
    riskNote: 'Do not promise lawyer coverage until filtered profiles are verified.',
  },
  {
    id: 'OWN-05',
    path: '/criminal-defense-attorney/',
    role: 'related_criminal_page',
    expectedRole: 'criminal defense overlap candidate',
    riskNote: 'Potential cannibalization if both pages target broad criminal lawyer intent.',
  },
  {
    id: 'OWN-06',
    path: '/sex-crime-lawyer/',
    role: 'related_criminal_page',
    expectedRole: 'specific criminal subtopic',
    riskNote: 'Should remain a specialist page and not be diluted by the local page.',
  },
  {
    id: 'OWN-07',
    path: '/traffic-lawyer/',
    role: 'adjacent_practice_page',
    expectedRole: 'traffic law surface only',
    riskNote: 'Adjacent but not the same user intent.',
  },
  {
    id: 'OWN-08',
    path: '/find-lawyer-how-to-find-good-attorney/',
    role: 'selection_guide',
    expectedRole: 'generic lawyer-selection support',
    riskNote: 'Useful trust/support link, not a criminal-law pillar.',
  },
];

const competitorRows = [
  {
    id: 'COMP-01',
    title: 'עו"ד דוד הלוי | משרד עורכי דין פלילי ירושלים',
    url: 'https://halevi-law.co.il/',
    serpObservation:
      'Competitor page emphasizes criminal case types, detention, evidence review, representation and long-term criminal-record issues.',
    copyBoundary: 'Do not copy service lists, claims, testimonials, case results or aggressive urgency framing.',
  },
  {
    id: 'COMP-02',
    title: 'עורך דין פלילי בירושלים - שלומי בן דור',
    url: 'https://sbd-law.co.il/',
    serpObservation:
      'Competitor page leans on former police/prosecution experience, interrogation preparation and immediate release language.',
    copyBoundary: 'Do not copy personal credentials, urgency promises or investigation-prep claims.',
  },
  {
    id: 'COMP-03',
    title: 'רמי בן חמו - עורך דין פלילי',
    url: 'https://rbh-law.co.il/',
    serpObservation:
      'Competitor page emphasizes Jerusalem office presence, availability and broad criminal/traffic disciplinary coverage.',
    copyBoundary: 'Do not copy availability promises, slogans, pricing or personal positioning.',
  },
  {
    id: 'COMP-04',
    title: 'אריאל עטרי - עורך דין פלילי בירושלים',
    url: 'https://atarilawfirm.co.il/',
    serpObservation:
      'Competitor page emphasizes experience, case volume and named public results.',
    copyBoundary: 'Do not copy outcome claims, media items, rankings or named-case positioning.',
  },
  {
    id: 'COMP-05',
    title: 'רועי יוסף אטיאס - עורך דין פלילי בירושלים',
    url: 'https://plilim.co.il/',
    serpObservation:
      'Competitor page positions a private lawyer brand with serious-crime, white-collar and public-figure work.',
    copyBoundary: 'Do not copy elite-client positioning, sensational language or case-type breadth as a Jus-Tice claim.',
  },
  {
    id: 'COMP-06',
    title: 'משרד עו"ד הוד דיין - משפט פלילי ותעבורה בירושלים',
    url: 'https://hodayan.co.il/',
    serpObservation:
      'Competitor page combines criminal and traffic work with strategy and evidence-review framing.',
    copyBoundary: 'Do not turn Jus-Tice into a law-firm voice; keep it a neutral legal-help/matching page.',
  },
];

const officialRows = [
  {
    id: 'OFF-01',
    title: 'בקשת ייצוג על ידי הסניגוריה הציבורית',
    url: 'https://www.gov.il/he/service/request-for-representation-by-the-public-defender-office',
    useFor: 'Cautious reference to official representation routes and eligibility-sensitive language.',
    boundary: 'Do not claim eligibility or advise which route a user should choose.',
  },
  {
    id: 'OFF-02',
    title: 'חוות דעת ועמדות רשמיות - הסניגוריה הציבורית',
    url: 'https://www.gov.il/he/departments/dynamiccollectors/official_opinions_and_positions',
    useFor: 'Rights-sensitive source prompt for suspect/defendant language.',
    boundary: 'Do not summarize rights as instructions without legal review.',
  },
];

const ctaMarkers = [
  'פנייה',
  'פניה',
  'בדיקת התאמה',
  'השאירו פרטים',
  'שליחת פרטים',
  'צור קשר',
  'צרו קשר',
  'וואטסאפ',
  'טלפון',
  'ייעוץ',
  'lawyer',
  'attorney',
  'contact',
  'whatsapp',
  'call',
];

const businessLeakMarkers = [
  'qualified lead',
  'lead partner',
  'manual invoice',
  'Grow',
  'Meshulam',
  'Morning plugin',
  'uPress',
  'Linear',
  'revenue',
  'supplier',
  'תוכנית עסקית',
  'מסלול הכנסה',
  'לידים בתשלום',
  'עורכי דין משלמים',
  'ספקים חיצוניים',
  'ספקי שירות',
  'ספקי לידים',
];

const publicClaimReviewMarkers = [
  'מומלץ',
  'מומלצים',
  'מוביל',
  'מובילים',
  'הטוב',
  'הכי טוב',
  'הצלחה',
  'הצלחות',
  'זיכוי',
  'מחירים',
  'בתי משפט',
  '24/7',
  'זמין מיידית',
  'מיידי',
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
  const base = `live-criminal-jerusalem-page-qa-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    decisionTemplateCsv: path.join(ROOT, '.project-control', `live-criminal-jerusalem-update-decision-template-${reportDate}.csv`),
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

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&#8217;/gi, "'")
    .replace(/&#8220;/gi, '"')
    .replace(/&#8221;/gi, '"')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function stripHtml(html) {
  return normalizeWhitespace(
    decodeEntities(String(html || ''))
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  );
}

function extractTag(html, tagName) {
  const match = String(html || '').match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match ? stripHtml(match[1]) : '';
}

function extractMeta(html, name) {
  const pattern = new RegExp(`<meta\\b(?=[^>]*(?:name|property)=["']${name}["'])[^>]*content=["']([^"']*)["'][^>]*>`, 'i');
  const match = String(html || '').match(pattern);
  return match ? decodeEntities(match[1]) : '';
}

function extractLinkRel(html, rel) {
  const pattern = new RegExp(`<link\\b(?=[^>]*rel=["'][^"']*${rel}[^"']*["'])[^>]*href=["']([^"']*)["'][^>]*>`, 'i');
  const match = String(html || '').match(pattern);
  return match ? decodeEntities(match[1]) : '';
}

function attrValue(attrs, name) {
  const match = String(attrs || '').match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, 'i'));
  return match ? decodeEntities(match[1]) : '';
}

function extractAnchors(html) {
  return [...String(html || '').matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({
      href: attrValue(match[1], 'href'),
      text: stripHtml(match[2]),
    }))
    .filter((anchor) => anchor.href || anchor.text);
}

function markerHits(text, markers) {
  const haystack = String(text || '').toLocaleLowerCase('he-IL');
  return markers.filter((marker) => haystack.includes(marker.toLocaleLowerCase('he-IL')));
}

function countWords(text) {
  return String(text || '').split(/\s+/).filter(Boolean).length;
}

function absoluteUrl(baseUrl, pathOrUrl) {
  return new URL(pathOrUrl, baseUrl).toString();
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}jt_live_qa=${Date.now()}`, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'user-agent': 'Mozilla/5.0 (compatible; JusTiceLiveCriminalJerusalemQA/1.0; +https://jus-tice.co.il/)',
      },
    });
    return {
      ok: response.ok,
      status: response.status,
      finalUrl: response.url,
      html: await response.text(),
    };
  } catch (error) {
    return {
      ok: false,
      status: 'ERROR',
      finalUrl: url,
      html: '',
      error: error.name === 'AbortError' ? 'timeout' : error.message,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function analyzeOwnRoute(baseUrl, route) {
  const url = absoluteUrl(baseUrl, route.path);
  const fetched = await fetchHtml(url);
  const text = stripHtml(fetched.html);
  const anchors = extractAnchors(fetched.html);
  const ctaAnchors = anchors.filter((anchor) => {
    const combined = `${anchor.text} ${anchor.href}`;
    return markerHits(combined, ctaMarkers).length > 0 || /^tel:/i.test(anchor.href) || /wa\.me|whatsapp/i.test(anchor.href);
  });
  const internalAnchors = anchors.filter((anchor) => {
    try {
      const parsed = new URL(anchor.href, baseUrl);
      return parsed.hostname === new URL(baseUrl).hostname;
    } catch {
      return false;
    }
  });

  return {
    ...route,
    url,
    status: fetched.status,
    ok: fetched.ok,
    final_url: fetched.finalUrl,
    title: extractTag(fetched.html, 'title'),
    h1: extractTag(fetched.html, 'h1'),
    meta_description: extractMeta(fetched.html, 'description'),
    canonical: extractLinkRel(fetched.html, 'canonical'),
    robots: extractMeta(fetched.html, 'robots'),
    word_estimate: countWords(text),
    anchor_count: anchors.length,
    internal_anchor_count: internalAnchors.length,
    cta_anchor_count: ctaAnchors.length,
    cta_texts: ctaAnchors
      .slice(0, 8)
      .map((anchor) => normalizeWhitespace(anchor.text || anchor.href))
      .join(' | '),
    public_claim_hits: markerHits(`${extractTag(fetched.html, 'title')} ${extractTag(fetched.html, 'h1')} ${text}`, publicClaimReviewMarkers).join(' | '),
    business_leak_hits: markerHits(text, businessLeakMarkers).join(' | '),
    fetch_error: fetched.error || '',
  };
}

async function analyzeCompetitor(row) {
  const fetched = await fetchHtml(row.url);
  const text = stripHtml(fetched.html);
  return {
    ...row,
    status: fetched.status,
    final_url: fetched.finalUrl,
    live_title: extractTag(fetched.html, 'title'),
    live_h1: extractTag(fetched.html, 'h1'),
    word_estimate: countWords(text),
    claim_hits: markerHits(`${extractTag(fetched.html, 'title')} ${extractTag(fetched.html, 'h1')} ${text}`, publicClaimReviewMarkers).join(' | '),
    fetch_error: fetched.error || '',
  };
}

function buildQaRows(ownRows, competitorAnalysis) {
  const target = ownRows.find((row) => row.role === 'live_target') || {};
  const declaredPillar = ownRows.find((row) => row.role === 'declared_pillar') || {};
  const topicPillar = ownRows.find((row) => row.role === 'practice_archive_or_topic') || {};
  const relatedCriminalRows = ownRows.filter((row) => row.role === 'related_criminal_page');
  const liveCompetitors = competitorAnalysis.filter((row) => row.status === 200);

  return [
    {
      id: 'CJQA-01',
      gate: 'target_live_status',
      status: target.status === 200 ? 'REVIEW_CONFIRMED_LIVE_200' : 'BLOCKED_TARGET_NOT_LIVE_200',
      evidence: `Target ${target.url || ''} returned ${target.status}; title "${target.title || ''}"; h1 "${target.h1 || ''}".`,
      review: 'The page is public and should be treated as an existing live asset, not a draft seed.',
      next_action: 'Do read-only QA first; do not publish, unpublish or rewrite from draft packets alone.',
    },
    {
      id: 'CJQA-02',
      gate: 'thin_content_and_helpfulness',
      status: Number(target.word_estimate || 0) >= 800 ? 'PASS' : 'REVIEW_THIN_LOCAL_PAGE',
      evidence: `Target word estimate ${target.word_estimate || 0}; CTA anchor count ${target.cta_anchor_count || 0}; internal links ${target.internal_anchor_count || 0}.`,
      review: 'The live target appears relatively thin for a competitive criminal-law local query; any improvement needs sources and legal/editor review.',
      next_action: 'Prepare evidence-backed outline sections only after GSC/internal overlap/lawyer coverage proof.',
    },
    {
      id: 'CJQA-03',
      gate: 'claim_and_source_safety',
      status: target.public_claim_hits ? 'REVIEW_PUBLIC_CLAIMS' : 'PASS',
      evidence: `Public-claim markers in target title/H1/body: ${target.public_claim_hits || 'none'}.`,
      review: 'Markers such as prices/courts/leading/recommended/outcomes need source or legal review before expansion.',
      next_action: 'Avoid adding price, court, best/recommended, guarantee, outcome or urgent advice language.',
    },
    {
      id: 'CJQA-04',
      gate: 'business_language_leakage',
      status: target.business_leak_hits ? 'BLOCKED_BUSINESS_LANGUAGE_FOUND' : 'PASS',
      evidence: `Business/internal markers: ${target.business_leak_hits || 'none'}.`,
      review: 'The live page should remain a legal-help page and not expose revenue, supplier, CRM or operating model language.',
      next_action: 'Keep lawyer-join/business language off the page except approved, subtle site-level paths.',
    },
    {
      id: 'CJQA-05',
      gate: 'pillar_cannibalization',
      status:
        Number(declaredPillar.word_estimate || 0) < 500 || Number(topicPillar.word_estimate || 0) < 500
          ? 'REVIEW_WEAK_PILLAR_SPLIT'
          : 'PASS',
      evidence: `Declared pillar ${declaredPillar.status}/${declaredPillar.word_estimate || 0} words/final ${declaredPillar.final_url || ''}; topic surface ${topicPillar.status}/${topicPillar.word_estimate || 0} words.`,
      review: 'The intended criminal-law pillar appears weak or redirected, so the live local page may be competing with a thin topic surface.',
      next_action: 'Do not expand the local page until the central criminal-law role, canonical target and internal-link hierarchy are reviewed.',
    },
    {
      id: 'CJQA-06',
      gate: 'related_criminal_overlap',
      status: relatedCriminalRows.some((row) => row.status === 200) ? 'REVIEW_OVERLAP_EXISTS' : 'PASS',
      evidence: relatedCriminalRows.map((row) => `${row.path}:${row.status}/${row.word_estimate || 0}w`).join(' | '),
      review: 'Related criminal pages exist, so local-page improvements need an internal overlap map before link/copy changes.',
      next_action: 'Keep the Jerusalem page as local triage and lawyer-fit support; leave specialist topics to their own pages.',
    },
    {
      id: 'CJQA-07',
      gate: 'competitor_positioning',
      status: liveCompetitors.length >= 3 ? 'REVIEW_COMPETITIVE_SERP' : 'REVIEW_COMPETITOR_FETCH_LIMITED',
      evidence: `${liveCompetitors.length}/${competitorAnalysis.length} competitor pages fetched as live 200; search results emphasize urgency, credentials, case types and local office presence.`,
      review: 'Jus-Tice should not mimic a single law office. The safer differentiation is neutral legal-help triage, document prep, and filtered lawyer fit.',
      next_action: 'Use competitor review for user expectations only; do not copy claims, credentials, results or slogans.',
    },
    {
      id: 'CJQA-08',
      gate: 'public_action_approval',
      status: 'BLOCKED_NO_PUBLIC_CHANGE_APPROVED',
      evidence: '0 CMS writes, 0 redirects/canonicals/noindex/sitemap/taxonomy changes, 0 CRM/contact/payment/email actions.',
      review: 'This packet approves no public action.',
      next_action: 'Owner/legal/editor/GSC review must clear one exact update before public work.',
    },
  ];
}

function buildDecisionTemplateRows() {
  return [
    {
      item: 'live_page_owner_decision',
      slug: 'criminal-lawyer-jerusalem',
      required_evidence: 'Owner confirms whether to preserve, revise, consolidate, or park page.',
      current_value: '',
      approved_by: '',
      approval_date: '',
      notes_no_pii: '',
    },
    {
      item: 'gsc_query_page_evidence',
      slug: 'criminal-lawyer-jerusalem',
      required_evidence: '90-day query/page export for criminal lawyer Jerusalem and overlapping criminal-law pages.',
      current_value: '',
      approved_by: '',
      approval_date: '',
      notes_no_pii: '',
    },
    {
      item: 'pillar_role_decision',
      slug: 'criminal-lawyer-jerusalem',
      required_evidence: 'Decide whether /criminal-lawyer/ or /practice-areas/criminal-law/ is the central surface.',
      current_value: '',
      approved_by: '',
      approval_date: '',
      notes_no_pii: '',
    },
    {
      item: 'lawyer_coverage_proof',
      slug: 'criminal-lawyer-jerusalem',
      required_evidence: 'Filtered Jerusalem criminal-law lawyer profile count and quality check.',
      current_value: '',
      approved_by: '',
      approval_date: '',
      notes_no_pii: '',
    },
    {
      item: 'legal_editor_review',
      slug: 'criminal-lawyer-jerusalem',
      required_evidence: 'Legal/editor review clears title/H1/body claims, sources and disclaimers.',
      current_value: '',
      approved_by: '',
      approval_date: '',
      notes_no_pii: '',
    },
  ];
}

function buildProjectMarkdown({ reportDate, summary, qaRows, ownRows, competitorAnalysis }) {
  return [
    `# Live Criminal Jerusalem Page QA - ${reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: read-only live QA for the existing public `/criminal-lawyer-jerusalem/` page. This packet does not publish, edit CMS content, change SEO settings, contact anyone, create records, send email or deploy.',
    '',
    '## Summary',
    '',
    `- Target status: ${summary.targetStatus}.`,
    `- Target word estimate: ${summary.targetWordEstimate}.`,
    `- QA rows: ${summary.qaRows}; review rows: ${summary.reviewRows}; blocked rows: ${summary.blockedRows}.`,
    `- Own-site live rows: ${summary.ownRows}.`,
    `- Competitor rows: ${summary.competitorRows}; live competitor fetches: ${summary.liveCompetitorRows}.`,
    '- Public actions: 0 CMS writes, 0 public page changes, 0 SEO setting changes, 0 CRM/contact/payment/email actions.',
    '',
    '## QA Rows',
    '',
    '| ID | Gate | Status | Evidence | Review | Next Action |',
    '| --- | --- | --- | --- | --- | --- |',
    ...qaRows.map(
      (row) =>
        `| ${mdCell(row.id)} | ${mdCell(row.gate)} | ${mdCell(row.status)} | ${mdCell(row.evidence)} | ${mdCell(row.review)} | ${mdCell(row.next_action)} |`,
    ),
    '',
    '## Own-Site Rows',
    '',
    '| ID | Path | Role | Status | Words | CTAs | Claim Hits | Business Hits | Final URL |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...ownRows.map(
      (row) =>
        `| ${mdCell(row.id)} | ${mdCell(row.path)} | ${mdCell(row.role)} | ${mdCell(row.status)} | ${mdCell(row.word_estimate)} | ${mdCell(row.cta_anchor_count)} | ${mdCell(row.public_claim_hits || '-')} | ${mdCell(row.business_leak_hits || '-')} | ${mdCell(row.final_url)} |`,
    ),
    '',
    '## Competitor Snapshot',
    '',
    '| ID | Title | Status | Words | Observation | Boundary | URL |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...competitorAnalysis.map(
      (row) =>
        `| ${mdCell(row.id)} | ${mdCell(row.title)} | ${mdCell(row.status)} | ${mdCell(row.word_estimate)} | ${mdCell(row.serpObservation)} | ${mdCell(row.copyBoundary)} | ${mdCell(row.url)} |`,
    ),
    '',
    '## Official Source Prompts',
    '',
    '| ID | Title | Use For | Boundary | URL |',
    '| --- | --- | --- | --- | --- |',
    ...officialRows.map(
      (row) => `| ${mdCell(row.id)} | ${mdCell(row.title)} | ${mdCell(row.useFor)} | ${mdCell(row.boundary)} | ${mdCell(row.url)} |`,
    ),
    '',
    '## Review',
    '',
    'The live Jerusalem criminal-law page is a real public asset and should not be handled as an unpublished draft. It appears commercially relevant but thin for a competitive local criminal-law query, and it contains source-sensitive title/H1 themes such as prices and courts. The central criminal-law pillar also appears weak/redirected, which raises cannibalization risk. Next step is not a public edit; it is owner/GSC/legal review of the exact role of this page versus the criminal-law pillar and related specialist pages.',
    '',
  ].join('\n');
}

function printHelp() {
  console.log('Usage: node tools/build-live-criminal-jerusalem-page-qa.mjs [--reportDate=YYYY-MM-DD] [--baseUrl=https://jus-tice.co.il]');
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  const files = outputFiles(args.reportDate);
  const ownRows = [];
  for (const route of ownRoutes) {
    ownRows.push(await analyzeOwnRoute(args.baseUrl, route));
  }

  const competitorAnalysis = [];
  for (const competitor of competitorRows) {
    competitorAnalysis.push(await analyzeCompetitor(competitor));
  }

  const qaRows = buildQaRows(ownRows, competitorAnalysis);
  const target = ownRows.find((row) => row.role === 'live_target') || {};
  const summary = {
    reportDate: args.reportDate,
    status: 'LIVE_CRIMINAL_JERUSALEM_QA_REVIEW_NO_PUBLIC_CHANGE',
    targetUrl: target.url,
    targetStatus: target.status,
    targetTitle: target.title,
    targetH1: target.h1,
    targetWordEstimate: target.word_estimate || 0,
    qaRows: qaRows.length,
    passRows: qaRows.filter((row) => row.status === 'PASS').length,
    reviewRows: qaRows.filter((row) => row.status.includes('REVIEW')).length,
    blockedRows: qaRows.filter((row) => row.status.includes('BLOCKED')).length,
    ownRows: ownRows.length,
    competitorRows: competitorAnalysis.length,
    liveCompetitorRows: competitorAnalysis.filter((row) => row.status === 200).length,
    officialSourceRows: officialRows.length,
    publicChangesApproved: 0,
    cmsWritesApproved: 0,
    seoSettingsChanged: 0,
    redirectsOrCanonicalsChanged: 0,
    crmRecordsCreated: 0,
    leadOrLawyerContactActions: 0,
    invoicesOrPaymentsCreated: 0,
    emailsSent: 0,
    upressDeploymentRequired: false,
  };

  const decisionRows = buildDecisionTemplateRows();
  const report = {
    ...summary,
    qaRows,
    ownRows,
    competitorRows: competitorAnalysis,
    officialRows,
    decisionRows,
    files: Object.fromEntries(Object.entries(files).map(([key, value]) => [key, path.relative(ROOT, value).replace(/\\/g, '/')])),
  };

  writeText(files.projectMd, buildProjectMarkdown({ reportDate: args.reportDate, summary, qaRows, ownRows, competitorAnalysis }));
  writeText(
    files.projectCsv,
    toCsv(qaRows, ['id', 'gate', 'status', 'evidence', 'review', 'next_action']),
  );
  writeText(files.reportJson, `${JSON.stringify(report, null, 2)}\n`);
  writeText(
    files.reportCsv,
    toCsv(
      [
        ...qaRows.map((row) => ({ row_type: 'qa', ...row })),
        ...ownRows.map((row) => ({ row_type: 'own', ...row })),
        ...competitorAnalysis.map((row) => ({ row_type: 'competitor', ...row })),
        ...officialRows.map((row) => ({ row_type: 'official', ...row })),
      ],
      [
        'row_type',
        'id',
        'path',
        'role',
        'gate',
        'status',
        'url',
        'final_url',
        'title',
        'h1',
        'word_estimate',
        'cta_anchor_count',
        'public_claim_hits',
        'business_leak_hits',
        'evidence',
        'review',
        'next_action',
        'serpObservation',
        'copyBoundary',
        'useFor',
        'boundary',
      ],
    ),
  );
  writeText(
    files.decisionTemplateCsv,
    toCsv(decisionRows, ['item', 'slug', 'required_evidence', 'current_value', 'approved_by', 'approval_date', 'notes_no_pii']),
  );

  console.log(
    JSON.stringify(
      {
        reportDate: summary.reportDate,
        status: summary.status,
        targetStatus: summary.targetStatus,
        targetWordEstimate: summary.targetWordEstimate,
        qaRows: summary.qaRows,
        reviewRows: summary.reviewRows,
        blockedRows: summary.blockedRows,
        ownRows: summary.ownRows,
        competitorRows: summary.competitorRows,
        liveCompetitorRows: summary.liveCompetitorRows,
        publicChangesApproved: summary.publicChangesApproved,
        cmsWritesApproved: summary.cmsWritesApproved,
        seoSettingsChanged: summary.seoSettingsChanged,
        emailsSent: summary.emailsSent,
        upressDeploymentRequired: summary.upressDeploymentRequired,
        files: report.files,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
