import fs from 'fs';
import path from 'path';
import { supabase } from './supabase.js';

// Absolute path to the local cache file, located in the same directory as the module
const CACHE_FILE_PATH = path.join(process.cwd(), 'src/lib/reviews-cache.json');
const LOCK_FILE_PATH = CACHE_FILE_PATH + '.lock';
const TMP_FILE_PATH = CACHE_FILE_PATH + '.tmp';

// Mock Seed Data used to initialize the cache if it doesn't exist yet
const MOCK_SEED_REVIEWS = [
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function acquireLock() {
  const maxRetries = 100;
  const baseDelay = 50;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const fd = fs.openSync(LOCK_FILE_PATH, 'wx');
      fs.closeSync(fd);
      return;
    } catch (err) {
      if (err.code === 'EEXIST' || err.code === 'EPERM' || err.code === 'EACCES') {
        const jitter = Math.random() * 30;
        const delay = baseDelay + jitter;
        await sleep(delay);
      } else {
        throw err;
      }
    }
  }
  throw new Error('Could not acquire review lock: max retries reached');
}

function releaseLock() {
  try {
    if (fs.existsSync(LOCK_FILE_PATH)) {
      fs.unlinkSync(LOCK_FILE_PATH);
    }
  } catch (err) {
    console.error('Failed to release lock:', err);
  }
}

/**
 * Reads reviews from the local JSON cache.
 * If the file does not exist, it initializes it with seed data.
 */
function readLocalCache() {
  try {
    const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    if (error.code === 'ENOENT') {
      const tmpPath = `${CACHE_FILE_PATH}.${process.pid}.${Date.now()}.tmp`;
      try {
        const dir = path.dirname(CACHE_FILE_PATH);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(tmpPath, JSON.stringify(MOCK_SEED_REVIEWS, null, 2), 'utf-8');
        fs.renameSync(tmpPath, CACHE_FILE_PATH);
      } catch (writeError) {
        try {
          if (fs.existsSync(tmpPath)) {
            fs.unlinkSync(tmpPath);
          }
        } catch (_) {}
        throw writeError;
      }
      return MOCK_SEED_REVIEWS;
    }
    throw error;
  }
}

/**
 * Writes reviews array to the local JSON cache.
 */
function writeLocalCache(reviews) {
  const tmpPath = `${CACHE_FILE_PATH}.${process.pid}.${Date.now()}.tmp`;
  try {
    const dir = path.dirname(CACHE_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(tmpPath, JSON.stringify(reviews, null, 2), 'utf-8');
    fs.renameSync(tmpPath, CACHE_FILE_PATH);
    return true;
  } catch (error) {
    console.error('Failed to write reviews to local cache:', error);
    try {
      if (fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
    } catch (_) {}
    return false;
  }
}

/**
 * Helper to calculate aggregate ratings over a set of approved reviews.
 * @param {Array} approvedReviews 
 */
function calculateAggregate(approvedReviews) {
  if (!approvedReviews || approvedReviews.length === 0) {
    return { ratingValue: 0, reviewCount: 0 };
  }
  const totalRating = approvedReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  const avg = totalRating / approvedReviews.length;
  return {
    ratingValue: Number(avg.toFixed(1)),
    reviewCount: approvedReviews.length
  };
}

/**
 * Retrieves all approved reviews, optionally filtered by reviewer_role.
 * Computes global aggregate ratings for all approved reviews.
 * 
 * @param {string} [roleFilter] - Optional role filter ('Client', 'Colleague', 'Google')
 */
export async function getApprovedReviews(roleFilter) {
  // 1. Try Supabase if available
  if (supabase) {
    try {
      // First, fetch the global aggregate ratings (all approved reviews)
      const { data: allApproved, error: aggError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('approval_status', true);

      if (aggError) throw aggError;

      // Next, fetch the filtered approved reviews
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('approval_status', true);

      if (roleFilter) {
        query = query.eq('reviewer_role', roleFilter);
      }

      const { data: reviews, error: reviewsError } = await query.order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      const aggregateRating = calculateAggregate(allApproved);

      return {
        success: true,
        reviews,
        aggregateRating,
        source: 'supabase'
      };
    } catch (dbError) {
      console.error('Supabase query failed, falling back to local cache:', dbError.message);
    }
  }

  // 2. Fallback to Local Filesystem Cache
  const localReviews = readLocalCache();
  const allApproved = localReviews.filter(r => r.approval_status === true);
  
  // Apply role filter on approved reviews if specified
  const filteredReviews = roleFilter
    ? allApproved.filter(r => r.reviewer_role === roleFilter)
    : allApproved;

  // Sort by created_at descending (latest first)
  filteredReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const aggregateRating = calculateAggregate(allApproved);

  return {
    success: true,
    reviews: filteredReviews,
    aggregateRating,
    source: 'cache'
  };
}

/**
 * Submits a new review with status pending approval.
 * 
 * @param {Object} reviewData
 * @param {string} reviewData.reviewer_name
 * @param {string} reviewData.reviewer_role
 * @param {number} reviewData.rating
 * @param {string} reviewData.content
 */
export async function submitReview({ reviewer_name, reviewer_role, rating, content }) {
  // Input validations
  if (!reviewer_name || typeof reviewer_name !== 'string' || reviewer_name.trim().length === 0) {
    throw new Error('שם הממליץ הינו שדה חובה');
  }
  if (reviewer_name.length > 150) {
    throw new Error('שם הממליץ ארוך מדי (מקסימום 150 תווים)');
  }
  if (!reviewer_role || !['Client', 'Colleague', 'Google'].includes(reviewer_role)) {
    throw new Error('תפקיד הממליץ אינו תקין (חייב להיות Client, Colleague או Google)');
  }
  if (Array.isArray(rating) || (typeof rating !== 'string' && typeof rating !== 'number')) {
    throw new Error('דירוג חייב להיות מספר שלם בין 1 ל-5');
  }
  const ratingInt = parseInt(rating, 10);
  if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
    throw new Error('דירוג חייב להיות מספר שלם בין 1 ל-5');
  }
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    throw new Error('תוכן ההמלצה הינו שדה חובה');
  }
  if (content.length > 3000) {
    throw new Error('תוכן ההמלצה ארוך מדי (מקסימום 3000 תווים)');
  }

  const newReviewPayload = {
    reviewer_name: reviewer_name.trim(),
    reviewer_role,
    rating: ratingInt,
    content: content.trim(),
    approval_status: false, // Force approval_status to false for safety
    created_at: new Date().toISOString()
  };

  // 1. Try Supabase if available
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([newReviewPayload])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        review: data,
        source: 'supabase'
      };
    } catch (dbError) {
      console.error('Supabase review insert failed, falling back to local cache:', dbError.message);
    }
  }

  // 2. Fallback to Local Filesystem Cache
  const maxRetries = 100;
  const baseDelay = 50;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    let lockAcquired = false;
    try {
      const fd = fs.openSync(LOCK_FILE_PATH, 'wx');
      fs.closeSync(fd);
      lockAcquired = true;

      const localReviews = readLocalCache();
      
      const cacheReview = {
        id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        ...newReviewPayload
      };

      localReviews.push(cacheReview);
      
      const writeSuccess = writeLocalCache(localReviews);
      if (!writeSuccess) {
        throw new Error('Write failed');
      }

      return {
        success: true,
        review: cacheReview,
        source: 'cache'
      };
    } catch (err) {
      if (lockAcquired) {
        releaseLock();
        lockAcquired = false;
      }
      
      const isTransient = err.code === 'EEXIST' ||
                          err.code === 'EACCES' ||
                          err.code === 'EPERM' ||
                          err.code === 'EBUSY' ||
                          err.code === 'EAGAIN';
      
      if (isTransient && attempt < maxRetries - 1) {
        const jitter = Math.random() * 30;
        const delay = baseDelay + jitter;
        await sleep(delay);
      } else {
        throw err;
      }
    } finally {
      if (lockAcquired) {
        releaseLock();
      }
    }
  }
  throw new Error('Could not complete review submission: max retries reached');
}

/**
 * Approves a review by its ID.
 * 
 * @param {string|number} id - The unique identifier of the review to approve
 */
export async function approveReview(id) {
  if (!id) {
    throw new Error('מזהה חוות הדעת הינו שדה חובה לצורך אישור');
  }

  // 1. Try Supabase if available
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({ approval_status: true })
        .eq('id', id)
        .select();

      if (error) throw error;

      // Note: If no rows were updated, it might be in the local cache or doesn't exist
      if (data && data.length > 0) {
        return {
          success: true,
          approved: true,
          source: 'supabase'
        };
      }
      
      console.warn(`Review ID ${id} not found in Supabase. Checking local cache.`);
    } catch (dbError) {
      console.error('Supabase review approval failed, trying local cache fallback:', dbError.message);
    }
  }

  // 2. Fallback to Local Filesystem Cache
  const maxRetries = 100;
  const baseDelay = 50;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    let lockAcquired = false;
    try {
      const fd = fs.openSync(LOCK_FILE_PATH, 'wx');
      fs.closeSync(fd);
      lockAcquired = true;

      const localReviews = readLocalCache();
      const reviewIndex = localReviews.findIndex(r => String(r.id) === String(id));

      if (reviewIndex === -1) {
        throw new Error(`חוות דעת עם מזהה ${id} לא נמצאה`);
      }

      localReviews[reviewIndex].approval_status = true;
      
      const writeSuccess = writeLocalCache(localReviews);
      if (!writeSuccess) {
        throw new Error('Write failed');
      }

      return {
        success: true,
        approved: true,
        source: 'cache'
      };
    } catch (err) {
      if (lockAcquired) {
        releaseLock();
        lockAcquired = false;
      }
      
      const isTransient = err.code === 'EEXIST' ||
                          err.code === 'EACCES' ||
                          err.code === 'EPERM' ||
                          err.code === 'EBUSY' ||
                          err.code === 'EAGAIN';
      
      if (isTransient && attempt < maxRetries - 1) {
        const jitter = Math.random() * 30;
        const delay = baseDelay + jitter;
        await sleep(delay);
      } else {
        throw err;
      }
    } finally {
      if (lockAcquired) {
        releaseLock();
      }
    }
  }
  throw new Error('Could not complete review approval: max retries reached');
}
