import { NextResponse } from 'next/server';
import { getApprovedReviews, addReview } from '@/lib/reviews';

/**
 * GET /api/reviews
 * Retrieves approved reviews. Supports an optional role filter.
 * Output format: { success: true, reviews: Array, aggregateRating: { ratingValue, reviewCount } }
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // Client, Colleague, or Google

    // Optional validation for the role filter
    if (role && !['Client', 'Colleague', 'Google'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role filter. Allowed values: Client, Colleague, Google' },
        { status: 400 }
      );
    }

    const result = await getApprovedReviews(role);
    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/reviews error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reviews
 * Submits a new review with approval_status defaulting to false (pending approval).
 * Input format: { reviewer_name, reviewer_role, rating, content }
 * Output format: { success: true, review: Object }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { reviewer_name, reviewer_role, rating, content } = body;

    // Validate presence of required inputs
    if (!reviewer_name || !reviewer_role || rating === undefined || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: reviewer_name, reviewer_role, rating, content' },
        { status: 400 }
      );
    }

    const result = await addReview({
      reviewer_name,
      reviewer_role,
      rating,
      content
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('POST /api/reviews error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
