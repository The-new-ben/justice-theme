import fs from 'fs/promises';
import path from 'path';
import { supabase } from './supabase';

const CACHE_FILE_PATH = path.join(process.cwd(), 'src/lib/reviews-cache.json');

// Self-contained default seed data for fallback
const SEED_REVIEWS = [
  {
    id: "rev_1",
    reviewer_name: "שרה לוי",
    reviewer_role: "Client",
    rating: 5,
    content: "קיבלתי שירות מעולה ומקצועי. עורך הדין שיוותה לי המערכת היה קשוב ומנוסה מאוד.",
    approval_status: true,
    created_at: "2026-06-01T10:00:00.000Z"
  },
  {
    id: "rev_2",
    reviewer_name: "עו\"ד דוד כהן",
    reviewer_role: "Colleague",
    rating: 5,
    content: "מערכת מצוינת המאפשרת שיתוף פעולה יעיל ונוח בין עורכי דין ללקוחות.",
    approval_status: true,
    created_at: "2026-06-02T12:30:00.000Z"
  },
  {
    id: "rev_3",
    reviewer_name: "משה מזרחי",
    reviewer_role: "Google",
    rating: 4,
    content: "חוויה מעולה, מצאתי עורך דין מתאים תוך דקות ספורות. ממליץ בחום!",
    approval_status: true,
    created_at: "2026-06-03T15:45:00.000Z"
  },
  {
    id: "rev_4",
    reviewer_name: "רוני אהרוני",
    reviewer_role: "Client",
    rating: 5,
    content: "הטיפול בתיק היה מהיר ומקצועי ביותר. תודה לצוות הפורטל.",
    approval_status: true,
    created_at: "2026-06-04T09:15:00.000Z"
  },
  {
    id: "rev_5",
    reviewer_name: "אורן גולן",
    reviewer_role: "Client",
    rating: 3,
    content: "חוות דעת ראשונית מעורפלת, אך בהמשך קיבלתי מענה טוב.",
    approval_status: false,
    created_at: "2026-06-05T14:00:00.000Z"
  }
];

// Fail-safe in-memory cache in case file system writes fail (e.g. read-only envs like Vercel)
let inMemoryReviews = null;

/**
 * Initialize / read the local file system cache
 */
async function readCacheFile() {
  try {
    // If in-memory cache is populated, we can use it, but check disk first for updates
    const data = await fs.readFile(CACHE_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    inMemoryReviews = parsed;
    return parsed;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Cache file not found, initializing with seed data...');
      await writeCacheFile(SEED_REVIEWS);
      inMemoryReviews = [...SEED_REVIEWS];
      return SEED_REVIEWS;
    }
    console.error('Failed to read cache file, using in-memory fallback:', error);
    if (!inMemoryReviews) {
      inMemoryReviews = [...SEED_REVIEWS];
    }
    return inMemoryReviews;
  }
}

/**
 * Write to the local cache file and update in-memory cache
 */
async function writeCacheFile(reviews) {
  try {
    inMemoryReviews = reviews;
    // Ensure the directory exists
    const dir = path.dirname(CACHE_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(reviews, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Failed to write to cache file, falling back to memory-only state:', error);
    return false;
  }
}

/**
 * Retrieve approved reviews and calculate aggregate metrics
 * Supports optional role filtering ('Client', 'Colleague', 'Google')
 */
export async function getApprovedReviews(roleFilter = null) {
  let reviewsList = [];
  let isUsingSupabase = false;

  if (supabase) {
    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('approval_status', true)
        .order('created_at', { ascending: false });

      if (roleFilter) {
        query = query.eq('reviewer_role', roleFilter);
      }

      const { data, error } = await query;
      if (!error && data) {
        reviewsList = data;
        isUsingSupabase = true;
      } else {
        console.warn('Supabase query error, falling back to cache:', error);
      }
    } catch (e) {
      console.error('Supabase exception, falling back to cache:', e);
    }
  }

  // Fallback to cache if Supabase is unavailable or failed
  if (!isUsingSupabase) {
    const cached = await readCacheFile();
    reviewsList = cached
      .filter(r => r.approval_status === true)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (roleFilter) {
      reviewsList = reviewsList.filter(r => r.reviewer_role === roleFilter);
    }
  }

  // Calculate Aggregates
  const reviewCount = reviewsList.length;
  const ratingSum = reviewsList.reduce((sum, r) => sum + r.rating, 0);
  const ratingValue = reviewCount > 0 ? parseFloat((ratingSum / reviewCount).toFixed(1)) : 0;

  return {
    success: true,
    reviews: reviewsList,
    aggregateRating: {
      ratingValue,
      reviewCount
    },
    datasource: isUsingSupabase ? 'supabase' : 'local_cache'
  };
}

/**
 * Submit a new review (defaults to approval_status: false)
 */
export async function addReview(reviewData) {
  const { reviewer_name, reviewer_role, rating, content } = reviewData;

  // Validation
  if (!reviewer_name || !reviewer_role || !rating || !content) {
    throw new Error('Missing required fields');
  }
  if (!['Client', 'Colleague', 'Google'].includes(reviewer_role)) {
    throw new Error('Invalid reviewer role');
  }
  const ratingInt = parseInt(rating, 10);
  if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
    throw new Error('Rating must be an integer between 1 and 5');
  }

  const newReview = {
    reviewer_name,
    reviewer_role,
    rating: ratingInt,
    content,
    approval_status: false,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([newReview])
        .select()
        .single();

      if (!error && data) {
        return {
          success: true,
          review: data,
          datasource: 'supabase'
        };
      }
      console.warn('Supabase insert failed, using fallback:', error);
    } catch (e) {
      console.error('Supabase insert exception, using fallback:', e);
    }
  }

  // Fallback to local cache
  const cached = await readCacheFile();
  const reviewWithId = {
    id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    ...newReview
  };

  cached.push(reviewWithId);
  await writeCacheFile(cached);

  return {
    success: true,
    review: reviewWithId,
    datasource: 'local_cache'
  };
}

/**
 * Approve a review by ID
 */
export async function approveReview(id) {
  if (!id) {
    throw new Error('Review ID is required for approval');
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({ approval_status: true })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return {
          success: true,
          approved: true,
          review: data,
          datasource: 'supabase'
        };
      }
      console.warn('Supabase update failed, using fallback:', error);
    } catch (e) {
      console.error('Supabase update exception, using fallback:', e);
    }
  }

  // Fallback to local cache
  const cached = await readCacheFile();
  const reviewIndex = cached.findIndex(r => r.id === id);

  if (reviewIndex === -1) {
    throw new Error(`Review with ID ${id} not found`);
  }

  cached[reviewIndex].approval_status = true;
  await writeCacheFile(cached);

  return {
    success: true,
    approved: true,
    review: cached[reviewIndex],
    datasource: 'local_cache'
  };
}

/**
 * Get all reviews (both approved and pending) - Useful for admin dashboards
 */
export async function getAllReviews() {
  let reviewsList = [];
  let isUsingSupabase = false;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        reviewsList = data;
        isUsingSupabase = true;
      }
    } catch (e) {
      console.error('Supabase query exception, fallback to cache:', e);
    }
  }

  if (!isUsingSupabase) {
    const cached = await readCacheFile();
    reviewsList = [...cached].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return {
    success: true,
    reviews: reviewsList,
    datasource: isUsingSupabase ? 'supabase' : 'local_cache'
  };
}
