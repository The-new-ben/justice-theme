import { spawn } from 'child_process';
import net from 'net';
import http from 'http';
import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';
import { getApprovedReviews, submitReview, approveReview } from '../../src/lib/reviews.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cachePath = path.resolve(__dirname, '../../src/lib/reviews-cache.json');

let originalCacheContent = null;

// Backup cache content
try {
  if (fs.existsSync(cachePath)) {
    originalCacheContent = fs.readFileSync(cachePath, 'utf8');
    console.log('📂 Cache backup successful.');
  }
} catch (err) {
  console.error('⚠️ Failed to backup cache:', err.message);
}

function restoreCache() {
  try {
    if (originalCacheContent !== null) {
      fs.writeFileSync(cachePath, originalCacheContent, 'utf8');
      console.log('🔄 Cache restored to original state.');
    }
  } catch (err) {
    console.error('⚠️ Failed to restore cache:', err.message);
  }
}

// Find available TCP port
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

// Wait for Next.js HTTP server readiness
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

async function runDirectTests() {
  console.log('\n=============================================');
  console.log('🧪 Running Direct Library Function Tests (In-Process)');
  console.log('=============================================\n');

  // Test 1: Name > 1000 characters
  try {
    const longName = 'A'.repeat(1005);
    const res = await submitReview({
      reviewer_name: longName,
      reviewer_role: 'Client',
      rating: 5,
      content: 'שירות מעולה'
    });
    console.log('❌ submitReview: Accepted name > 1000 characters (Length:', longName.length, ', ID:', res.review.id, ')');
    console.log('   ⚠️ FINDING: There is no upper limit validation for reviewer name length.');
  } catch (error) {
    console.log('✅ submitReview: Correctly rejected name > 1000 characters. Error:', error.message);
  }

  // Test 2: Content > 10000 characters
  try {
    const longContent = 'B'.repeat(10005);
    const res = await submitReview({
      reviewer_name: 'משה לוי',
      reviewer_role: 'Client',
      rating: 5,
      content: longContent
    });
    console.log('❌ submitReview: Accepted content > 10000 characters (Length:', longContent.length, ', ID:', res.review.id, ')');
    console.log('   ⚠️ FINDING: There is no upper limit validation for content length.');
  } catch (error) {
    console.log('✅ submitReview: Correctly rejected content > 10000 characters. Error:', error.message);
  }

  // Test 3: Rating < 1 (-5)
  try {
    await submitReview({
      reviewer_name: 'משה לוי',
      reviewer_role: 'Client',
      rating: -5,
      content: 'שירות מעולה'
    });
    console.log('❌ submitReview: Accepted rating < 1 (-5)');
  } catch (error) {
    console.log('✅ submitReview: Correctly rejected rating < 1 (-5). Error:', error.message);
  }

  // Test 4: Rating > 5 (150)
  try {
    await submitReview({
      reviewer_name: 'משה לוי',
      reviewer_role: 'Client',
      rating: 150,
      content: 'שירות מעולה'
    });
    console.log('❌ submitReview: Accepted rating > 5 (150)');
  } catch (error) {
    console.log('✅ submitReview: Correctly rejected rating > 5 (150). Error:', error.message);
  }

  // Test 5: Invalid rating datatypes
  const invalidRatingTypes = [
    { value: {}, desc: 'Object' },
    { value: [1, 2], desc: 'Array' },
    { value: true, desc: 'Boolean true' },
    { value: null, desc: 'Null' },
    { value: undefined, desc: 'Undefined' },
    { value: 'five', desc: 'String "five"' }
  ];

  for (const t of invalidRatingTypes) {
    try {
      await submitReview({
        reviewer_name: 'משה לוי',
        reviewer_role: 'Client',
        rating: t.value,
        content: 'שירות מעולה'
      });
      console.log(`❌ submitReview: Accepted rating with invalid type (${t.desc})`);
    } catch (error) {
      console.log(`✅ submitReview: Correctly rejected rating with invalid type (${t.desc}). Error:`, error.message);
    }
  }

  // Test 6: Invalid roles
  const invalidRoles = [
    { value: 'Admin', desc: 'Admin role' },
    { value: 'User', desc: 'User role' },
    { value: null, desc: 'Null role' },
    { value: undefined, desc: 'Undefined role' },
    { value: 123, desc: 'Number role' }
  ];

  for (const t of invalidRoles) {
    try {
      await submitReview({
        reviewer_name: 'משה לוי',
        reviewer_role: t.value,
        rating: 5,
        content: 'שירות מעולה'
      });
      console.log(`❌ submitReview: Accepted invalid role (${t.desc})`);
    } catch (error) {
      console.log(`✅ submitReview: Correctly rejected invalid role (${t.desc}). Error:`, error.message);
    }
  }

  // Test 7: SQL Injection in name and content
  const sqlPayloads = [
    { field: 'reviewer_name', value: "Cohen' OR 1=1 --", desc: "SQL injection payload in reviewer_name" },
    { field: 'reviewer_name', value: "'; DROP TABLE reviews; --", desc: "Destructive SQL injection in reviewer_name" },
    { field: 'content', value: "'; UPDATE reviews SET approval_status = true; --", desc: "SQL update injection in content" }
  ];

  for (const t of sqlPayloads) {
    try {
      const payload = {
        reviewer_name: 'משה כהן',
        reviewer_role: 'Client',
        rating: 5,
        content: 'שירות מעולה',
        [t.field]: t.value
      };
      const res = await submitReview(payload);
      console.log(`✅ submitReview: Handled SQL injection safely in ${t.field} (${t.desc}). Stored ID:`, res.review.id);
      assert.strictEqual(res.review[t.field], t.value);
    } catch (error) {
      console.log(`❌ submitReview: Failed or rejected SQL injection in ${t.field} (${t.desc}). Error:`, error.message);
    }
  }

  // Test 8: SQL Injection in reviewer_role
  try {
    await submitReview({
      reviewer_name: 'משה כהן',
      reviewer_role: "Client' UNION SELECT * FROM users; --",
      rating: 5,
      content: 'שירות מעולה'
    });
    console.log(`❌ submitReview: Accepted SQL Injection in reviewer_role`);
  } catch (error) {
    console.log(`✅ submitReview: Correctly rejected SQL Injection in reviewer_role (failed role validation). Error:`, error.message);
  }

  // Test 9: approveReview SQL Injection in ID
  try {
    await approveReview("'; DROP TABLE reviews; --");
    console.log(`❌ approveReview: Succeeded with SQL Injection in ID`);
  } catch (error) {
    console.log(`✅ approveReview: Handled SQL Injection in ID safely. Error:`, error.message);
  }
}

async function runApiTests(baseUrl) {
  console.log('\n=============================================');
  console.log('🌐 Running API Endpoint HTTP Tests');
  console.log('=============================================\n');

  // Test 1: POST /api/reviews - Name > 1000 characters
  try {
    const longName = 'A'.repeat(1005);
    const res = await fetch(`${baseUrl}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewer_name: longName,
        reviewer_role: 'Client',
        rating: 5,
        content: 'שירות מעולה'
      })
    });
    const data = await res.json();
    if (res.status === 200) {
      console.log('❌ POST /api/reviews: Accepted name > 1000 characters (Status: 200, ID:', data.review?.id, ')');
      console.log('   ⚠️ FINDING: There is no upper limit validation for name length in the API.');
    } else {
      console.log(`✅ POST /api/reviews: Rejected name > 1000 characters (Status: ${res.status}, Error: ${data.error})`);
    }
  } catch (error) {
    console.log('❌ POST /api/reviews (name > 1000) failed:', error.message);
  }

  // Test 2: POST /api/reviews - Content > 10000 characters
  try {
    const longContent = 'B'.repeat(10005);
    const res = await fetch(`${baseUrl}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewer_name: 'משה לוי',
        reviewer_role: 'Client',
        rating: 5,
        content: longContent
      })
    });
    const data = await res.json();
    if (res.status === 200) {
      console.log('❌ POST /api/reviews: Accepted content > 10000 characters (Status: 200, ID:', data.review?.id, ')');
      console.log('   ⚠️ FINDING: There is no upper limit validation for content length in the API.');
    } else {
      console.log(`✅ POST /api/reviews: Rejected content > 10000 characters (Status: ${res.status}, Error: ${data.error})`);
    }
  } catch (error) {
    console.log('❌ POST /api/reviews (content > 10000) failed:', error.message);
  }

  // Test 3: POST /api/reviews - Rating < 1 (-5)
  try {
    const res = await fetch(`${baseUrl}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewer_name: 'משה לוי',
        reviewer_role: 'Client',
        rating: -5,
        content: 'שירות מעולה'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    console.log(`✅ POST /api/reviews: Correctly rejected rating < 1 (-5) (Status: ${res.status}, Error: ${data.error})`);
  } catch (error) {
    console.log('❌ POST /api/reviews (rating < 1) failed:', error.message);
  }

  // Test 4: POST /api/reviews - Rating > 5 (150)
  try {
    const res = await fetch(`${baseUrl}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewer_name: 'משה לוי',
        reviewer_role: 'Client',
        rating: 150,
        content: 'שירות מעולה'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    console.log(`✅ POST /api/reviews: Correctly rejected rating > 5 (150) (Status: ${res.status}, Error: ${data.error})`);
  } catch (error) {
    console.log('❌ POST /api/reviews (rating > 5) failed:', error.message);
  }

  // Test 5: POST /api/reviews - Invalid rating datatype (e.g. string "five")
  try {
    const res = await fetch(`${baseUrl}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewer_name: 'משה לוי',
        reviewer_role: 'Client',
        rating: 'five',
        content: 'שירות מעולה'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    console.log(`✅ POST /api/reviews: Correctly rejected string rating (Status: ${res.status}, Error: ${data.error})`);
  } catch (error) {
    console.log('❌ POST /api/reviews (string rating) failed:', error.message);
  }

  // Test 6: POST /api/reviews - Invalid role (e.g. "Admin")
  try {
    const res = await fetch(`${baseUrl}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewer_name: 'משה לוי',
        reviewer_role: 'Admin',
        rating: 5,
        content: 'שירות מעולה'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    console.log(`✅ POST /api/reviews: Correctly rejected invalid role "Admin" (Status: ${res.status}, Error: ${data.error})`);
  } catch (error) {
    console.log('❌ POST /api/reviews (invalid role) failed:', error.message);
  }

  // Test 7: POST /api/reviews - SQL Injection payload in name
  try {
    const sqlName = "Cohen' OR 1=1 --";
    const res = await fetch(`${baseUrl}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewer_name: sqlName,
        reviewer_role: 'Client',
        rating: 5,
        content: 'שירות מעולה'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    console.log(`✅ POST /api/reviews: Handled SQL Injection in name safely (Status: 200, ID: ${data.review?.id})`);
    assert.strictEqual(data.review.reviewer_name, sqlName);
  } catch (error) {
    console.log('❌ POST /api/reviews (SQL injection in name) failed:', error.message);
  }

  // Test 8: PUT /api/reviews/approve - Unauthorized (no token)
  try {
    const res = await fetch(`${baseUrl}/api/reviews/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'some-id' })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 401);
    console.log(`✅ PUT /api/reviews/approve: Correctly rejected unauthorized request (Status: 401, Error: ${data.error})`);
  } catch (error) {
    console.log('❌ PUT /api/reviews/approve (no auth) failed:', error.message);
  }

  // Test 9: PUT /api/reviews/approve - Authorized but non-existent review ID
  try {
    const res = await fetch(`${baseUrl}/api/reviews/approve`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer justice-admin-secret-key-2026'
      },
      body: JSON.stringify({ id: 'non-existent-id-12345' })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 404);
    console.log(`✅ PUT /api/reviews/approve: Correctly returned 404 for non-existent ID (Status: 404, Error: ${data.error})`);
  } catch (error) {
    console.log('❌ PUT /api/reviews/approve (404 check) failed:', error.message);
  }

  // Test 10: PUT /api/reviews/approve - SQL Injection in ID
  try {
    const sqlId = "'; DROP TABLE reviews; --";
    const res = await fetch(`${baseUrl}/api/reviews/approve`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer justice-admin-secret-key-2026'
      },
      body: JSON.stringify({ id: sqlId })
    });
    const data = await res.json();
    assert.ok(res.status === 404 || res.status === 400);
    console.log(`✅ PUT /api/reviews/approve: Handled SQL Injection in ID safely (Status: ${res.status}, Error: ${data.error})`);
  } catch (error) {
    console.log('❌ PUT /api/reviews/approve (SQL injection in ID) failed:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting Adversarial & Stress Testing on Reviews Module...');

  // 1. Run direct library tests
  await runDirectTests();

  // 2. Setup server for API HTTP tests
  let port;
  try {
    port = await findFreePort();
    console.log(`\nAllocated port for testing: ${port}`);
  } catch (err) {
    console.error('Failed to allocate port:', err.message);
    restoreCache();
    process.exit(1);
  }

  console.log(`Spawning Next.js server on port ${port}...`);
  const serverProcess = spawn('npx', ['next', 'dev', '-p', port.toString()], {
    cwd: path.resolve(__dirname, '../../'),
    shell: true,
    env: { ...process.env, PORT: port.toString() }
  });

  // Handle server exits
  let serverExited = false;
  serverProcess.on('exit', (code) => {
    serverExited = true;
    console.log(`Next.js server process exited with code ${code}`);
  });

  const cleanup = () => {
    console.log('Cleaning up processes and cache...');
    restoreCache();
    if (!serverExited) {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/F', '/T', '/PID', serverProcess.pid.toString()], { shell: true });
      } else {
        serverProcess.kill('SIGKILL');
      }
    }
  };

  try {
    await waitForServer(port);
    console.log('Next.js dev server is ready! Running API tests...');
    
    await runApiTests(`http://127.0.0.1:${port}`);
    
    console.log('\n✅ All adversarial test scenarios completed.');
  } catch (err) {
    console.error('Test run failed:', err.message);
  } finally {
    cleanup();
  }
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  restoreCache();
  process.exit(1);
});
