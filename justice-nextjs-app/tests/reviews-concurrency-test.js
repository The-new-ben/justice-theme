import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CACHE_FILE_PATH = path.join(process.cwd(), 'src/lib/reviews-cache.json');

// Original seed reviews to restore state
const SEED_REVIEWS = [
  {
    "id": "rev_1",
    "reviewer_name": "מיכל כהן",
    "reviewer_role": "Client",
    "rating": 5,
    "content": "שירות מקצועי ביותר, יחס אישי וליווי צמוד לכל אורך הדרך. ממליצה בחום על שירותי המשרד!",
    "approval_status": true,
    "created_at": "2026-06-01T10:00:00.000Z"
  },
  {
    "id": "rev_2",
    "reviewer_name": "דוד לוי",
    "reviewer_role": "Google",
    "rating": 4,
    "content": "עורכי דין מצוינים, עזרו לי לפתור בעיה משפטית מורכבת בתחום הנדל\"ן במהירות וביעילות.",
    "approval_status": true,
    "created_at": "2026-06-03T14:30:00.000Z"
  },
  {
    "id": "rev_3",
    "reviewer_name": "עו״ד אילן רפאל",
    "reviewer_role": "Colleague",
    "rating": 5,
    "content": "קולגה מוערך מאוד, מקצוען אמיתי וישר דרך. תמיד שמח לשתף פעולה בתיקים מורכבים.",
    "approval_status": true,
    "created_at": "2026-06-05T09:15:00.000Z"
  },
  {
    "id": "rev_4",
    "reviewer_name": "שרה ישראלי",
    "reviewer_role": "Client",
    "rating": 5,
    "content": "הייצוג המשפטי הטוב ביותר שקיבלתי. תודה רבה לצוות על המסירות וההקשבה.",
    "approval_status": true,
    "created_at": "2026-06-07T16:00:00.000Z"
  },
  {
    "id": "rev_5",
    "reviewer_name": "אלון מזרחי",
    "reviewer_role": "Client",
    "rating": 3,
    "content": "השירות היה סביר, אך לעיתים לקח זמן לקבל מענה טלפוני לעדכונים בתיק.",
    "approval_status": false,
    "created_at": "2026-06-08T11:00:00.000Z"
  },
  {
    "id": "rev_6",
    "reviewer_name": "אורן גולן",
    "reviewer_role": "Google",
    "rating": 5,
    "content": "Professional and responsive legal service. Guided us through our labor dispute successfully.",
    "approval_status": true,
    "created_at": "2026-06-08T12:00:00.000Z"
  },
  {
    "id": "rev_7",
    "reviewer_name": "רונית אשכנזי",
    "reviewer_role": "Colleague",
    "rating": 4,
    "content": "משרד מקצועי עם הבנה מעמיקה בליטיגציה מסחרית. מומלץ מאוד.",
    "approval_status": false,
    "created_at": "2026-06-08T15:30:00.000Z"
  }
];

function resetCache() {
  fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(SEED_REVIEWS, null, 2), 'utf-8');
}

// Check CLI arguments
if (process.argv[2] === '--child') {
  // CHILD PROCESS BEHAVIOR
  // Force local fallback cache by clearing Supabase credentials
  process.env.NEXT_PUBLIC_SUPABASE_URL = '';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';

  const reviewerName = process.argv[3] || 'Anonymous Child';
  
  import('../src/lib/reviews.js')
    .then(async (module) => {
      const res = await module.submitReview({
        reviewer_name: reviewerName,
        reviewer_role: 'Client',
        rating: 5,
        content: `Child process concurrency test submission.`
      });
      console.log(JSON.stringify({ success: true, id: res.review.id }));
      process.exit(0);
    })
    .catch((err) => {
      console.error(JSON.stringify({ success: false, error: err.message, stack: err.stack }));
      process.exit(1);
    });
} else {
  // ORCHESTRATOR BEHAVIOR
  async function runOrchestrator() {
    console.log('=== Reviews Cache Concurrency & Stress Test ===\n');

    // --- PHASE 1: IN-PROCESS CONCURRENCY ---
    console.log('--- Phase 1: In-Process Concurrency Test (50 parallel promises in 1 event loop) ---');
    resetCache();
    
    // Clear Supabase creds to ensure local cache is target of dynamic import
    process.env.NEXT_PUBLIC_SUPABASE_URL = '';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';
    
    const { submitReview } = await import('../src/lib/reviews.js');

    const phase1Promises = [];
    const NUM_REQUESTS = 50;

    console.log(`Submitting ${NUM_REQUESTS} reviews concurrently...`);
    const startTime1 = Date.now();
    for (let i = 0; i < NUM_REQUESTS; i++) {
      phase1Promises.push(
        submitReview({
          reviewer_name: `SingleProcUser_${i}`,
          reviewer_role: 'Client',
          rating: 5,
          content: `In-process concurrency test review #${i}`
        })
      );
    }

    const results1 = await Promise.allSettled(phase1Promises);
    const duration1 = Date.now() - startTime1;

    let successCount1 = 0;
    let failCount1 = 0;
    results1.forEach((r) => {
      if (r.status === 'fulfilled') successCount1++;
      else failCount1++;
    });

    console.log(`Phase 1 Complete in ${duration1}ms.`);
    console.log(`Promises resolved successfully: ${successCount1}/${NUM_REQUESTS}`);
    console.log(`Promises rejected: ${failCount1}/${NUM_REQUESTS}`);

    // Verify cache integrity
    let cacheContent1;
    let cacheParseOk1 = true;
    try {
      const fileText = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
      cacheContent1 = JSON.parse(fileText);
    } catch (e) {
      cacheParseOk1 = false;
      console.error('❌ CRITICAL ERROR: Cache file JSON corruption in Phase 1!', e.message);
    }

    if (cacheParseOk1) {
      const numOriginal = SEED_REVIEWS.length;
      const expectedTotal = numOriginal + NUM_REQUESTS;
      const actualTotal = cacheContent1.length;
      const submittedInCache = cacheContent1.filter(r => r.reviewer_name.startsWith('SingleProcUser')).length;
      
      console.log(`Cache file parses successfully as JSON: Yes`);
      console.log(`Expected reviews in cache: ${expectedTotal} (${numOriginal} seed + ${NUM_REQUESTS} submitted)`);
      console.log(`Actual reviews in cache: ${actualTotal}`);
      console.log(`Submitted reviews successfully found in cache: ${submittedInCache}`);

      if (submittedInCache === NUM_REQUESTS) {
        console.log('✅ Phase 1 Verification PASSED: No lost updates or corruptions detected in-process.');
      } else {
        console.log('❌ Phase 1 Verification FAILED: Lost updates detected in-process.');
      }
    }

    console.log('\n----------------------------------------------------------------------\n');

    // --- PHASE 2: MULTI-PROCESS CONCURRENCY ---
    console.log('--- Phase 2: Multi-Process Concurrency Test (50 parallel OS processes) ---');
    resetCache();

    const phase2Promises = [];
    console.log(`Spawning ${NUM_REQUESTS} parallel Node child processes to write to the cache simultaneously...`);
    const startTime2 = Date.now();

    for (let i = 0; i < NUM_REQUESTS; i++) {
      phase2Promises.push(
        new Promise((resolve) => {
          const cp = spawn('node', ['tests/reviews-concurrency-test.js', '--child', `MultiProcUser_${i}`], {
            cwd: process.cwd(),
            shell: true
          });

          let stdout = '';
          let stderr = '';
          cp.stdout.on('data', (d) => stdout += d.toString());
          cp.stderr.on('data', (d) => stderr += d.toString());

          cp.on('close', (code) => {
            resolve({
              index: i,
              code,
              stdout: stdout.trim(),
              stderr: stderr.trim()
            });
          });
        })
      );
    }

    const results2 = await Promise.all(phase2Promises);
    const duration2 = Date.now() - startTime2;

    let successCount2 = 0;
    let failCount2 = 0;
    const failures = [];

    results2.forEach((r) => {
      if (r.code === 0) {
        successCount2++;
      } else {
        failCount2++;
        failures.push(r);
      }
    });

    console.log(`Phase 2 Complete in ${duration2}ms.`);
    console.log(`Child processes exited with code 0: ${successCount2}/${NUM_REQUESTS}`);
    console.log(`Child processes failed/exited with error: ${failCount2}/${NUM_REQUESTS}`);

    if (failures.length > 0) {
      console.log('Sample process failures:');
      failures.slice(0, 3).forEach((f) => {
        console.log(`  Process #${f.index} exited with code ${f.code}`);
        console.log(`    stdout: ${f.stdout}`);
        console.log(`    stderr: ${f.stderr}`);
      });
    }

    // Verify cache integrity for Phase 2
    let cacheContent2;
    let cacheParseOk2 = true;
    let fileText2 = '';
    try {
      fileText2 = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
      cacheContent2 = JSON.parse(fileText2);
    } catch (e) {
      cacheParseOk2 = false;
      console.error('❌ CRITICAL ERROR: Cache file JSON corruption in Phase 2!', e.message);
      console.error('Raw content preview:');
      console.error(fileText2.slice(0, 500) + (fileText2.length > 500 ? '...' : ''));
    }

    if (cacheParseOk2) {
      const numOriginal = SEED_REVIEWS.length;
      const expectedTotal = numOriginal + NUM_REQUESTS;
      const actualTotal = cacheContent2.length;
      const submittedInCache = cacheContent2.filter(r => r.reviewer_name.startsWith('MultiProcUser')).length;
      
      console.log(`Cache file parses successfully as JSON: Yes`);
      console.log(`Expected reviews in cache: ${expectedTotal} (${numOriginal} seed + ${NUM_REQUESTS} submitted)`);
      console.log(`Actual reviews in cache: ${actualTotal}`);
      console.log(`Submitted reviews successfully found in cache: ${submittedInCache}`);

      const lostUpdates = NUM_REQUESTS - submittedInCache;
      console.log(`Lost updates: ${lostUpdates} reviews were overwritten/lost!`);

      if (submittedInCache === NUM_REQUESTS) {
        console.log('✅ Phase 2 Verification PASSED: No lost updates or corruptions detected.');
      } else {
        console.log('❌ Phase 2 Verification FAILED: Lost updates detected under multi-process concurrency.');
      }
    } else {
      console.log('❌ Phase 2 Verification FAILED: JSON cache file was corrupted/broken due to concurrent write collisions.');
    }

    // Restore clean cache state
    console.log('\nRestoring cache to initial seed state...');
    resetCache();
    console.log('Restore complete. Done.');
  }

  runOrchestrator().catch(err => {
    console.error('Test runner exception:', err);
    resetCache();
  });
}
