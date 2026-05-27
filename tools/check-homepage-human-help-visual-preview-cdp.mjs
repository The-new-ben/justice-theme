import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const PASS_STATUS = 'HOMEPAGE_HUMAN_HELP_VISUAL_QA_PASS_NO_PUBLIC_CHANGE';
const REVIEW_STATUS = 'HOMEPAGE_HUMAN_HELP_VISUAL_QA_REVIEW_NO_PUBLIC_CHANGE';

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    previewPath: process.env.PREVIEW_PATH || `.project-control/homepage-human-help-visual-qa-preview-${process.env.REPORT_DATE || DEFAULT_REPORT_DATE}.html`,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
      if (!process.env.PREVIEW_PATH) {
        args.previewPath = `.project-control/homepage-human-help-visual-qa-preview-${args.reportDate}.html`;
      }
    } else if (arg.startsWith('--previewPath=')) {
      args.previewPath = arg.slice('--previewPath='.length);
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

function chromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);

  const found = candidates.find((candidate) => existsSync(candidate));
  if (!found) {
    throw new Error('Chrome or Edge executable was not found for headless visual QA.');
  }
  return found;
}

function outputFiles(reportDate) {
  const base = `homepage-human-help-visual-qa-${reportDate}`;
  return {
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    desktopPng: path.join(ROOT, '.project-control', 'visual-evidence', `${base}-desktop.png`),
    mobilePng: path.join(ROOT, '.project-control', 'visual-evidence', `${base}-mobile.png`),
  };
}

function relativePath(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function writeText(filePath, text) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
}

function writeBytes(filePath, bytes) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, bytes);
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

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.html') return 'text/html; charset=utf-8';
  if (ext === '.css') return 'text/css; charset=utf-8';
  if (ext === '.js') return 'text/javascript; charset=utf-8';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.svg') return 'image/svg+xml';
  return 'application/octet-stream';
}

async function startStaticServer() {
  const server = createServer((req, res) => {
    const rawUrl = new URL(req.url || '/', 'http://127.0.0.1');
    const requestPath = decodeURIComponent(rawUrl.pathname).replace(/^\/+/, '');
    const absolutePath = path.resolve(ROOT, requestPath || 'index.html');

    if (!absolutePath.startsWith(ROOT) || !existsSync(absolutePath)) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('not found');
      return;
    }

    res.writeHead(200, { 'content-type': contentType(absolutePath) });
    res.end(readFileSync(absolutePath));
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  return {
    server,
    port: address.port,
  };
}

async function waitForCdp(port, timeoutMs = 8000) {
  const started = Date.now();
  let lastError = null;

  while (Date.now() - started < timeoutMs) {
    try {
      const result = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (result.ok) {
        return await result.json();
      }
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  throw new Error(`Timed out waiting for Chrome CDP: ${lastError?.message || 'unknown error'}`);
}

async function connectCdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const events = [];

  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
      return;
    }
    events.push(message);
  });

  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  return {
    ws,
    events,
    send(method, params = {}) {
      return new Promise((resolve) => {
        const messageId = ++id;
        pending.set(messageId, resolve);
        ws.send(JSON.stringify({ id: messageId, method, params }));
      });
    },
    waitFor(method, timeoutMs = 8000) {
      const existingIndex = events.findIndex((event) => event.method === method);
      if (existingIndex >= 0) {
        const [event] = events.splice(existingIndex, 1);
        return Promise.resolve(event);
      }

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error(`Timed out waiting for ${method}`)), timeoutMs);
        const listener = (event) => {
          const message = JSON.parse(event.data);
          if (message.method === method) {
            clearTimeout(timeout);
            ws.removeEventListener('message', listener);
            resolve(message);
          }
        };
        ws.addEventListener('message', listener);
      });
    },
  };
}

async function createTarget(cdpPort) {
  const response = await fetch(`http://127.0.0.1:${cdpPort}/json/new?about:blank`, { method: 'PUT' });
  if (!response.ok) {
    throw new Error(`Failed to create Chrome target: ${response.status}`);
  }
  return response.json();
}

async function closeTarget(cdpPort, targetId) {
  try {
    await fetch(`http://127.0.0.1:${cdpPort}/json/close/${targetId}`);
  } catch {
    // Best effort cleanup only.
  }
}

async function inspectViewport({ cdpPort, url, viewport, screenshotPath }) {
  const target = await createTarget(cdpPort);
  const cdp = await connectCdp(target.webSocketDebuggerUrl);

  try {
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width < 700,
    });

    const loaded = cdp.waitFor('Page.loadEventFired');
    await cdp.send('Page.navigate', { url });
    await loaded;
    await new Promise((resolve) => setTimeout(resolve, 300));

    const expression = `(() => {
      const selectors = ['.hero__first-steps','.homepage-situation-router','.homepage-intent-card__prep','.homepage-intent-pyramid__lawyer-path','.homepage-intent-pyramid__trust-note'];
      const doc = document.documentElement;
      const boxes = selectors.map((selector) => {
        const elements = Array.from(document.querySelectorAll(selector));
        return {
          selector,
          count: elements.length,
          visible: elements.filter((el) => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
          }).length,
          minLeft: Math.min(0, ...elements.map((el) => Math.round(el.getBoundingClientRect().left))),
          maxRight: Math.max(0, ...elements.map((el) => Math.round(el.getBoundingClientRect().right))),
        };
      });
      const offenders = Array.from(document.querySelectorAll('body *'))
        .map((el) => ({ el, rect: el.getBoundingClientRect() }))
        .filter(({ rect }) => rect.width > 0 && (rect.left < -1 || rect.right > window.innerWidth + 1))
        .slice(0, 12)
        .map(({ el, rect }) => ({
          tag: el.tagName,
          className: String(el.className || ''),
          text: (el.textContent || '').trim().slice(0, 80),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        }));
      return {
        label: '${viewport.label}',
        innerWidth: window.innerWidth,
        scrollWidth: doc.scrollWidth,
        overflowX: doc.scrollWidth > window.innerWidth + 1,
        selectorsPresent: boxes.every((box) => box.count > 0 && box.visible > 0),
        boxes,
        offenders,
      };
    })()`;

    const evaluation = await cdp.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
    });

    const screenshot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
      fromSurface: true,
    });

    writeBytes(screenshotPath, Buffer.from(screenshot.result.data, 'base64'));

    return {
      ...evaluation.result.result.value,
      screenshot: relativePath(screenshotPath),
    };
  } finally {
    cdp.ws.close();
    await closeTarget(cdpPort, target.id);
  }
}

function buildMarkdown({ summary, desktop, mobile }) {
  return [
    `# Homepage human-help visual QA - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'This is an internal browser QA result for the static homepage preview. It does not publish to WordPress and does not change the live site.',
    '',
    '## Results',
    '',
    '| Viewport | Width | Scroll width | Overflow X | Selectors present | Screenshot |',
    '| --- | ---: | ---: | --- | --- | --- |',
    `| Desktop | ${desktop.innerWidth} | ${desktop.scrollWidth} | ${desktop.overflowX ? 'yes' : 'no'} | ${desktop.selectorsPresent ? 'yes' : 'no'} | \`${desktop.screenshot}\` |`,
    `| Mobile | ${mobile.innerWidth} | ${mobile.scrollWidth} | ${mobile.overflowX ? 'yes' : 'no'} | ${mobile.selectorsPresent ? 'yes' : 'no'} | \`${mobile.screenshot}\` |`,
    '',
    '## Remaining Risk',
    '',
    '- This verifies the internal static preview, not the live WordPress-rendered homepage.',
    '- Public deployment still requires owner approval and live/staging route QA.',
    '- uPress Pull is not required because this is not approved live deployment.',
    '',
  ].join('\n');
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/check-homepage-human-help-visual-preview-cdp.mjs --reportDate=YYYY-MM-DD');
    return;
  }

  const previewAbsolute = path.resolve(ROOT, args.previewPath);
  if (!existsSync(previewAbsolute) || !previewAbsolute.startsWith(ROOT)) {
    throw new Error(`Missing or unsafe preview path: ${args.previewPath}`);
  }

  const files = outputFiles(args.reportDate);
  const staticServer = await startStaticServer();
  const cdpPort = 9231 + Math.floor(Math.random() * 500);
  const chrome = spawn(chromePath(), [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${path.join(tmpdir(), `justice-homepage-qa-${Date.now()}`)}`,
    'about:blank',
  ], {
    stdio: 'ignore',
    detached: false,
  });

  try {
    await waitForCdp(cdpPort);
    const previewUrl = `http://127.0.0.1:${staticServer.port}/${relativePath(previewAbsolute)}`;
    const desktop = await inspectViewport({
      cdpPort,
      url: previewUrl,
      viewport: { label: 'desktop', width: 1366, height: 1200 },
      screenshotPath: files.desktopPng,
    });
    const mobile = await inspectViewport({
      cdpPort,
      url: previewUrl,
      viewport: { label: 'mobile', width: 390, height: 1200 },
      screenshotPath: files.mobilePng,
    });

    const pass = !desktop.overflowX && !mobile.overflowX && desktop.selectorsPresent && mobile.selectorsPresent;
    const summary = {
      status: pass ? PASS_STATUS : REVIEW_STATUS,
      reportDate: args.reportDate,
      previewHtml: relativePath(previewAbsolute),
      desktopOverflowX: desktop.overflowX,
      mobileOverflowX: mobile.overflowX,
      selectorsPresentDesktop: desktop.selectorsPresent,
      selectorsPresentMobile: mobile.selectorsPresent,
      desktopScreenshot: desktop.screenshot,
      mobileScreenshot: mobile.screenshot,
      publicCmsChangesApproved: 0,
      paidLlmApiUsed: 0,
      upressDeploymentRequired: false,
      readinessToProfitPercent: pass ? 74 : 70,
      liveRevenueImpactPercent: 0,
    };

    const report = { ...summary, desktop, mobile };
    writeText(files.reportJson, `${JSON.stringify(report, null, 2)}\n`);
    writeText(files.reportCsv, toCsv([summary], Object.keys(summary)));
    writeText(files.projectMd, buildMarkdown({ summary, desktop, mobile }));

    console.log(JSON.stringify(summary, null, 2));
  } finally {
    staticServer.server.close();
    chrome.kill();
  }
}

main();
