import { NextResponse } from 'next/server';
import { getApprovedReviews, submitReview } from '@/lib/reviews';

/**
 * GET /api/reviews
 * Retrieves all approved reviews.
 * Supports optional role filter via query string, e.g., `/api/reviews?role=Client`.
 * 
 * Interface Contract:
 * - Request: GET /api/reviews?role=Client (optional filter: Client/Colleague/Google)
 * - Response (200): { success: true, reviews: Array, aggregateRating: { ratingValue, reviewCount } }
 * - Response (500): { success: false, error: String }
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || undefined;

    // Validate role parameter if present
    if (role && !['Client', 'Colleague', 'Google'].includes(role)) {
      return NextResponse.json(
        { success: false, error: "סינון לפי תפקיד לא תקין. ערכים מותרים: 'Client', 'Colleague', 'Google'" },
        { status: 400 }
      );
    }

    const result = await getApprovedReviews(role);
    return NextResponse.json({
      success: true,
      reviews: result.reviews,
      aggregateRating: result.aggregateRating,
      _debug: { source: result.source } // Useful for dev inspection of storage source
    });
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
 * Submits a new review. The review status defaults to pending approval (approval_status: false).
 * 
 * Interface Contract:
 * - Request: POST /api/reviews with JSON body:
 *   { reviewer_name, reviewer_role, rating, content }
 * - Response (200): { success: true, review: Object }
 * - Response (400/500): { success: false, error: String }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { reviewer_name, reviewer_role, rating, content } = body;

    // Call helper which validates fields internally and saves to db or local cache
    const result = await submitReview({
      reviewer_name,
      reviewer_role,
      rating,
      content
    });

    return NextResponse.json({
      success: true,
      review: result.review,
      _debug: { source: result.source }
    });
  } catch (error) {
    console.error('POST /api/reviews error:', error);
    // Categorize validation errors vs server errors
    const isValidationError =
      error.message.includes('חובה') ||
      error.message.includes('תקין') ||
      error.message.includes('דירוג') ||
      error.message.includes('ארוך מדי') ||
      error.message.includes('מקסימום');
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: isValidationError ? 400 : 500 }
    );
  }
}
