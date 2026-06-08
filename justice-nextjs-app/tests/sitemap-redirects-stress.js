/**
 * Sitemap and Redirects Adversarial Stress-Test Harness
 * Performs static analysis of the redirect map and dynamic HTTP/concurrency testing.
 */

const { spawn } = require('child_process');
const net = require('net');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const REDIRECT_MAP_PATH = path.resolve(__dirname, '../src/lib/redirect-map.json');

// Helper to find a random available TCP port
function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', (err) => reject(err));
  });
}

// Helper to poll the server until it's responsive
function waitForServer(port, timeoutMs = 45000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Server readiness check timed out after ${timeoutMs}ms`));
        return;
      }
      
      const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
        resolve();
      });

      req.on('error', () => {
        setTimeout(check, 1000);
      });
      
      req.end();
    }
    check();
  });
}

// Helper to extract URLs from sitemap XML
function extractSitemapUrls(xmlText) {
  const regex = /<loc>([\s\S]*?)<\/loc>/gi;
  const urls = [];
  let match;
  while ((match = regex.exec(xmlText)) !== null) {
    urls.push(match[1].trim());
  }
  return urls;
}

// ----------------------------------------------------
// 1. STATIC REDIRECT MAP ANALYSIS
// ----------------------------------------------------
function runStaticAnalysis() {
  console.log('🔍 Running Static Analysis on redirect-map.json...');
  
  if (!fs.existsSync(REDIRECT_MAP_PATH)) {
    console.error(`❌ Redirect map not found at ${REDIRECT_MAP_PATH}`);
    process.exit(1);
  }

  const redirectMap = JSON.parse(fs.readFileSync(REDIRECT_MAP_PATH, 'utf8'));
  const keys = Object.keys(redirectMap);
  console.log(`📊 Total redirect rules: ${keys.length}`);

  const findings = [];
  const selfRedirects = [];
  const redirectChains = [];
  const loopDetect = {};
  const caseConflicts = {};
  const slashConflicts = {};

  for (const [source, target] of Object.entries(redirectMap)) {
    const normSource = source.toLowerCase().trim();
    const normTarget = target.toLowerCase().trim();

    // A. Self-redirect check
    if (normSource === normTarget || normSource === normTarget + '/' || normSource + '/' === normTarget) {
      selfRedirects.push({ source, target });
    }

    // B. Detect potential chains (A -> B, where B is also a source)
    if (redirectMap[target] || redirectMap[target + '/'] || (target.endsWith('/') && redirectMap[target.slice(0, -1)])) {
      const directTarget = redirectMap[target] || redirectMap[target + '/'] || redirectMap[target.slice(0, -1)];
      redirectChains.push({ source, target, finalTarget: directTarget });
    }

    // C. Detect loops
    let current = source;
    const visited = new Set();
    while (current && redirectMap[current]) {
      if (visited.has(current)) {
        if (!loopDetect[source]) {
          loopDetect[source] = Array.from(visited).concat(current);
        }
        break;
      }
      visited.add(current);
      current = redirectMap[current];
    }

    // D. Casing conflict check
    const lowerKey = source.toLowerCase();
    if (caseConflicts[lowerKey] && caseConflicts[lowerKey].target !== target) {
      caseConflicts[lowerKey].sources.push(source);
    } else {
      caseConflicts[lowerKey] = { target, sources: [source] };
    }

    // E. Slash conflict check (e.g. /path and /path/ pointing to different targets)
    const strippedKey = source.endsWith('/') && source.length > 1 ? source.slice(0, -1) : source;
    if (slashConflicts[strippedKey]) {
      if (slashConflicts[strippedKey].target !== target) {
        slashConflicts[strippedKey].sources.push(source);
      }
    } else {
      slashConflicts[strippedKey] = { target, sources: [source] };
    }
  }

  // Print Static Findings
  if (selfRedirects.length > 0) {
    console.log(`⚠️ Found ${selfRedirects.length} self-redirects (pointing to themselves):`);
    selfRedirects.slice(0, 5).forEach(r => console.log(`   - ${r.source} -> ${r.target}`));
    findings.push(`${selfRedirects.length} self-redirects detected.`);
  } else {
    console.log('✅ No self-redirects detected.');
  }

  const loopKeys = Object.keys(loopDetect);
  if (loopKeys.length > 0) {
    console.log(`❌ CRITICAL: Found ${loopKeys.length} infinite redirect loops:`);
    loopKeys.slice(0, 5).forEach(k => console.log(`   - Loop path: ${loopDetect[k].join(' -> ')}`));
    findings.push(`${loopKeys.length} infinite redirect loops detected.`);
  } else {
    console.log('✅ No infinite redirect loops detected.');
  }

  if (redirectChains.length > 0) {
    console.log(`⚠️ Found ${redirectChains.length} redirect chains (A -> B -> C):`);
    redirectChains.slice(0, 5).forEach(r => console.log(`   - ${r.source} -> ${r.target} -> ${r.finalTarget}`));
    findings.push(`${redirectChains.length} redirect chains detected.`);
  } else {
    console.log('✅ No redirect chains detected.');
  }

  const caseConflictKeys = Object.keys(caseConflicts).filter(k => caseConflicts[k].sources.length > 1);
  if (caseConflictKeys.length > 0) {
    console.log(`⚠️ Found ${caseConflictKeys.length} casing conflicts (same lowercased path pointing to different targets):`);
    caseConflictKeys.slice(0, 5).forEach(k => console.log(`   - Lower: ${k} | Sources: ${caseConflicts[k].sources.join(', ')}`));
    findings.push(`${caseConflictKeys.length} casing conflicts detected.`);
  } else {
    console.log('✅ No casing conflicts detected.');
  }

  const slashConflictKeys = Object.keys(slashConflicts).filter(k => slashConflicts[k].sources.length > 1);
  if (slashConflictKeys.length > 0) {
    console.log(`⚠️ Found ${slashConflictKeys.length} slash conflicts (trailing/non-trailing versions pointing to different targets):`);
    slashConflictKeys.slice(0, 5).forEach(k => console.log(`   - Base: ${k} | Sources: ${slashConflicts[k].sources.join(', ')}`));
    findings.push(`${slashConflictKeys.length} slash conflicts detected.`);
  } else {
    console.log('✅ No slash conflicts detected.');
  }

  console.log('Static analysis complete.\n');
  return findings;
}

// Helper to execute a test, catching its error to allow subsequent tests to run
async function runTest(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name} passed.`);
    return true;
  } catch (err) {
    console.error(`❌ ${name} failed:`, err.message);
    return false;
  }
}

// ----------------------------------------------------
// 2. DYNAMIC HTTP AND CONCURRENCY TESTS
// ----------------------------------------------------
async function runDynamicTests(baseUrl) {
  console.log('🌐 Running Dynamic HTTP and Concurrency tests...');
  let allPassed = true;

  // Test 2.1: Basic redirect mapping check
  allPassed = (await runTest('Test 2.1: Basic redirect mapping check', async () => {
    const testPath = '/פוסטה-פלילים';
    console.log(`Testing redirect for ${testPath}...`);
    const res1 = await fetch(`${baseUrl}/${encodeURIComponent(testPath.slice(1))}`, { redirect: 'manual' });
    assert.strictEqual(res1.status, 301, 'Basic redirect should return 301');
    const loc1 = res1.headers.get('location');
    console.log(`   - Location: ${loc1}`);
    assert.ok(loc1.includes('/posta'), 'Redirect location should map to /posta');
  })) && allPassed;

  // Test 2.2: Case-insensitivity (casing variations on English fallback keys if any, or general characters)
  allPassed = (await runTest('Test 2.2: Case-insensitivity', async () => {
    const upperEncoded = encodeURIComponent('פוסטה-פלילים').toUpperCase();
    const res2 = await fetch(`${baseUrl}/${upperEncoded}`, { redirect: 'manual' });
    assert.strictEqual(res2.status, 301, 'Uppercase percent-encoded redirect should return 301');
    const loc2 = res2.headers.get('location');
    assert.ok(loc2.includes('/posta'), 'Uppercase percent-encoded redirect target check');
  })) && allPassed;

  // Test 2.3: Trailing slash normalization
  allPassed = (await runTest('Test 2.3: Trailing slash normalization', async () => {
    const trailingPath = '/פוסטה-פלילים/';
    const res3 = await fetch(`${baseUrl}/${encodeURIComponent(trailingPath.slice(1, -1))}/`, { redirect: 'manual' });
    console.log(`   - Trailing slash redirect status: ${res3.status}, location: ${res3.headers.get('location')}`);
    assert.ok(res3.status === 301 || res3.status === 308, 'Trailing slash redirect should return 301 or 308');
    const loc3 = res3.headers.get('location');
    assert.ok(loc3.toLowerCase().includes('/posta') || loc3.toLowerCase().includes('/%d7%a4%d7%95%d7%a1%d7%98%d7%94-%d7%a4%d7%9c%d7%99%d7%9c%d7%99%d7%9d') || decodeURIComponent(loc3).includes('/פוסטה-פלילים'), 'Trailing slash redirect target check');
  })) && allPassed;

  // Test 2.4: Query parameters and hash preservation
  allPassed = (await runTest('Test 2.4: Query parameters and hash preservation', async () => {
    const res4 = await fetch(`${baseUrl}/${encodeURIComponent('פוסטה-פלילים')}?advocate=daniel&utm_source=test`, { redirect: 'manual' });
    assert.strictEqual(res4.status, 301, 'Query-param redirect should return 301');
    const loc4 = res4.headers.get('location');
    console.log(`   - Location with query: ${loc4}`);
    assert.ok(loc4.includes('/posta?advocate=daniel&utm_source=test'), 'Redirect must preserve search parameters');
  })) && allPassed;

  // Test 2.5: Malformed percent encoding handling
  allPassed = (await runTest('Test 2.5: Malformed percent encoding handling', async () => {
    const malformedPath = '/%d7%9e%d7%93%g7-bad-uri';
    console.log(`Testing malformed percent encoding: ${malformedPath}...`);
    const res5 = await fetch(`${baseUrl}${malformedPath}`);
    console.log(`   - Response status: ${res5.status}`);
    assert.ok(res5.status === 404 || res5.status === 400 || res5.status === 200, 'Malformed URI should handle gracefully without crashing');
  })) && allPassed;

  // Test 2.6: Concurrency stress testing (100 parallel redirect requests)
  allPassed = (await runTest('Test 2.6: Concurrency stress testing (100 parallel redirect requests)', async () => {
    const testPath = '/פוסטה-פלילים';
    console.log('🚀 Initiating 100 concurrent redirect requests...');
    const concurrentRequests = 100;
    const startTime = Date.now();
    const promises = [];
    
    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(
        fetch(`${baseUrl}/${encodeURIComponent(testPath.slice(1))}?request_id=${i}`, { redirect: 'manual' })
          .then(res => {
            assert.strictEqual(res.status, 301);
            return res.headers.get('location');
          })
      );
    }

    const results = await Promise.allSettled(promises);
    const duration = Date.now() - startTime;
    
    let successCount = 0;
    results.forEach(r => {
      if (r.status === 'fulfilled' && r.value.includes('/posta')) {
        successCount++;
      }
    });

    console.log(`   - Concurrency Results: ${successCount}/${concurrentRequests} successful redirects in ${duration}ms.`);
    assert.strictEqual(successCount, concurrentRequests, 'All concurrent redirect requests must succeed');
  })) && allPassed;

  if (!allPassed) {
    throw new Error('Some dynamic redirect tests failed.');
  }
}

// ----------------------------------------------------
// 3. SITEMAP DEEP VALIDATION
// ----------------------------------------------------
async function runSitemapValidation(baseUrl) {
  console.log('🔍 Running Sitemap Validation...');

  const res = await fetch(`${baseUrl}/sitemap.xml`);
  assert.strictEqual(res.status, 200, 'Sitemap should return 200 OK');
  assert.strictEqual(res.headers.get('content-type').includes('xml'), true, 'Content-type must be XML');

  const xmlText = await res.text();
  const urls = extractSitemapUrls(xmlText);
  console.log(`   - Sitemap contains ${urls.length} URLs`);

  // Assertions on sitemap URLs
  assert.ok(urls.length >= 20, 'Sitemap must contain at least 20 entries');

  const duplicateCheck = new Set();
  const duplicates = [];
  
  for (const url of urls) {
    // A. Correct Domain Prefix
    assert.ok(url.startsWith('https://jus-tice.co.il'), `URL ${url} must start with correct domain`);
    
    // B. No duplicate entries
    if (duplicateCheck.has(url)) {
      duplicates.push(url);
    }
    duplicateCheck.add(url);

    // C. No query params
    assert.strictEqual(url.includes('?'), false, `URL ${url} must not contain query parameters`);
    
    // D. No HTML tags or artifacts
    assert.strictEqual(url.includes('<') || url.includes('>'), false, `URL ${url} must not contain XML/HTML tags`);

    // E. Proper encoding check (no raw Hebrew spaces or illegal chars)
    assert.strictEqual(url.includes(' '), false, `URL ${url} must not contain spaces`);
  }

  if (duplicates.length > 0) {
    console.error(`❌ Duplicate URLs found in sitemap:`, duplicates);
    throw new Error(`Duplicate URLs detected in sitemap.xml: ${duplicates.join(', ')}`);
  } else {
    console.log('✅ No duplicate URLs found in sitemap.');
  }

  // Verify critical pages are listed
  const criticalPaths = [
    'https://jus-tice.co.il',
    'https://jus-tice.co.il/lawyers',
    'https://jus-tice.co.il/practice-areas',
    'https://jus-tice.co.il/practice-areas/labor-law',
    'https://jus-tice.co.il/practice-areas/real-estate-law',
    'https://jus-tice.co.il/practice-areas/medical-malpractice',
    'https://jus-tice.co.il/practice-areas/criminal-law',
    'https://jus-tice.co.il/practice-areas/family-law',
    'https://jus-tice.co.il/practice-areas/personal-injury',
    'https://jus-tice.co.il/practice-areas/labor-law/severance-pay-calculator',
    'https://jus-tice.co.il/lawyers/adv-daniel-cohen'
  ];

  for (const path of criticalPaths) {
    const encoded = path.split('/').map(segment => {
      // Encode Hebrew segments
      if (/[^\x00-\x7F]/.test(segment)) {
        return encodeURIComponent(segment);
      }
      return segment;
    }).join('/');

    const found = urls.some(u => u === path || u === encoded || decodeURIComponent(u) === decodeURIComponent(path));
    assert.ok(found, `Critical URL missing in sitemap: ${path}`);
  }

  console.log('✅ Sitemap validation passed.');
}

// ----------------------------------------------------
// MAIN RUNNER
// ----------------------------------------------------
async function main() {
  console.log('=============================================');
  console.log('🚀 JUS-TICE Sitemap & Redirects Stress-Test');
  console.log('=============================================\n');

  // 1. Run static analysis offline
  const staticFindings = runStaticAnalysis();

  // 2. Setup server for dynamic tests
  let port;
  try {
    port = await findFreePort();
    console.log(`Allocated port for testing: ${port}`);
  } catch (err) {
    console.error('Failed to allocate port:', err.message);
    process.exit(1);
  }

  console.log(`Spawning Next.js production server on port ${port}...`);
  const serverProcess = spawn('npx', ['next', 'start', '-p', port.toString()], {
    cwd: process.cwd(),
    shell: true,
    env: { ...process.env, PORT: port.toString(), NEXT_PUBLIC_GTM_ID: 'GTM-TEST1234' }
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`[Next.js Server] ${data.toString().trim()}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[Next.js Error] ${data.toString().trim()}`);
  });

  // Handle server exits
  let serverExited = false;
  serverProcess.on('exit', (code) => {
    serverExited = true;
    console.log(`Next.js server process exited with code ${code}`);
  });

  const cleanup = () => {
    console.log('\nCleaning up processes...');
    if (!serverExited) {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/F', '/T', '/PID', serverProcess.pid.toString()], { shell: true });
      } else {
        serverProcess.kill('SIGKILL');
      }
    }
  };

  let dynamicPassed = false;
  let sitemapPassed = false;
  try {
    await waitForServer(port);
    console.log('Next.js server is ready! Running dynamic scenarios...');
    
    const baseUrl = `http://127.0.0.1:${port}`;
    try {
      await runDynamicTests(baseUrl);
      dynamicPassed = true;
    } catch (e) {
      console.error('\n❌ Dynamic redirect tests failed:', e.message);
    }

    try {
      await runSitemapValidation(baseUrl);
      sitemapPassed = true;
    } catch (e) {
      console.error('\n❌ Sitemap validation tests failed:', e.message);
    }
    
    if (dynamicPassed && sitemapPassed) {
      console.log('\n✨ All sitemap and redirect stress tests completed successfully!');
    } else {
      console.error('\n❌ Stress-test completed with errors.');
      process.exit(1);
    }
    if (staticFindings.length > 0) {
      console.log(`\n⚠️ Note: Static analysis reported the following warnings/findings:\n- ${staticFindings.join('\n- ')}`);
    }
  } catch (err) {
    console.error('\n❌ Stress-test runner failed:', err.message);
    process.exit(1);
  } finally {
    cleanup();
  }
}

// Check if run directly
if (require.main === module) {
  main().catch(err => {
    console.error('Fatal execution error:', err);
    process.exit(1);
  });
}
