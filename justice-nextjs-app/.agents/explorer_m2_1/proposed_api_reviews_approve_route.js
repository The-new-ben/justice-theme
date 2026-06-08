import { NextResponse } from 'next/server';
import { approveReview } from '@/lib/reviews';

/**
 * PUT /api/reviews/approve
 * Approves a pending review by its ID.
 * Employs mock security checks (e.g. checking Authorization bearer token or x-admin-api-key).
 * 
 * Interface Contract:
 * - Request: PUT /api/reviews/approve with JSON body:
 *   { id }
 * - Response (200): { success: true, approved: true }
 * - Response (401/400/500): { success: false, error: String }
 */
export async function PUT(request) {
  try {
    // 1. Mock Security/Admin Checks
    const authHeader = request.headers.get('authorization');
    const adminHeaderKey = request.headers.get('x-admin-api-key');

    // Retrieve secret from environment variable, falling back to a default value for local testing
    const expectedSecret = process.env.ADMIN_API_KEY || 'mock-admin-secret-key';

    // Extract Bearer token if provided
    let token = null;
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      token = authHeader.substring(7).trim();
    }

    const isAuthorized = (token === expectedSecret) || (adminHeaderKey === expectedSecret);

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid or missing admin credentials.' },
        { status: 401 }
      );
    }

    // 2. Validate request body
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    // 3. Approve review in database (Supabase or Local Fallback)
    const result = await approveReview(id);

    return NextResponse.json({
      success: true,
      approved: true,
      review: result.review,
      _debug: { source: result.source }
    });
  } catch (error) {
    console.error('PUT /api/reviews/approve error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
