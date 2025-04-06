import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { verifyJwtToken } from '../../../../lib/jwt';
import { cookies } from 'next/headers';
import { checkSubscription } from '../middleware';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check subscription
    const subscriptionCheck = await checkSubscription(request);
    if (!subscriptionCheck.success) {
      return subscriptionCheck.response;
    }
    
    const userId = subscriptionCheck.userId;
    const companyId = parseInt(params.id);
    
    if (isNaN(companyId)) {
      return NextResponse.json(
        { error: 'Invalid company ID' },
        { status: 400 }
      );
    }
    
    // Get user ID from token
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const payload = verifyJwtToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    const userId = payload.id;
    const db = await getDb();
    
    // Check if company exists and belongs to the user
    const company = await db.get(
      'SELECT * FROM companies WHERE id = ? AND owner_id = ?',
      [companyId, userId]
    );
    
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }
    
    // Delete company-user relationships first
    await db.run(
      'DELETE FROM user_companies WHERE company_id = ?',
      [companyId]
    );
    
    // Delete the company
    await db.run(
      'DELETE FROM companies WHERE id = ?',
      [companyId]
    );
    
    return NextResponse.json({
      message: 'Company deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete company error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while deleting the company' },
      { status: 500 }
    );
  }
}