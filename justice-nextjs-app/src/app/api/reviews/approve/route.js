import { NextResponse } from 'next/server';
import { approveReview } from '@/lib/reviews';

/**
 * PUT /api/reviews/approve
 * Approves a review by its ID, transitioning approval_status from false (pending) to true (approved).
 * Includes mock security checks requiring an admin secret.
 * 
 * Interface Contract:
 * - Request: PUT /api/reviews/approve with JSON body:
 *   { id }
 * - Headers (one of the following must match the configured secret):
 *   - Authorization: Bearer <secret>
 *   - X-Admin-API-Key: <secret>
 *   - Response (200): { success: true, approved: true }
 *   - Response (401/400/500): { success: false, error: String }
 */
export async function PUT(request) {
  try {
    // 1. Mock Security Check
    const authHeader = request.headers.get('authorization');
    const adminApiKeyHeader = request.headers.get('x-admin-api-key');
    
    // Retrieve secret from env, or default to a standard development token
    const expectedSecret = process.env.ADMIN_APPROVE_SECRET;

    if (!expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    let isAuthorized = false;

    // Check Bearer Token
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7); // Remove 'Bearer '
      if (token === expectedSecret) {
        isAuthorized = true;
      }
    }

    // Check X-Admin-API-Key custom header
    if (adminApiKeyHeader && adminApiKeyHeader === expectedSecret) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'מורשה בלבד - מפתח אבטחה מנהל לא תקין או חסר' },
        { status: 401 }
      );
    }

    // 2. Body Parsing & ID Extraction
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'מזהה חוות הדעת (id) הינו שדה חובה' },
        { status: 400 }
      );
    }

    // 3. Action Execution (Supabase table update, fallback to local cache update)
    const result = await approveReview(id);

    return NextResponse.json({
      success: true,
      approved: true,
      _debug: { source: result.source }
    });
  } catch (error) {
    console.error('PUT /api/reviews/approve error:', error);
    
    const isNotFoundError = error.message.includes('לא נמצאה');
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: isNotFoundError ? 404 : 500 }
    );
  }
}
