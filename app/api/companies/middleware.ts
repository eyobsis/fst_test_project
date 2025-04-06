import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { verifyJwtToken } from '../../../lib/jwt';
import { cookies } from 'next/headers';

export async function checkSubscription(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    };
  }
  
  const payload = verifyJwtToken(token);
  if (!payload) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    };
  }
  
  const userId = payload.id;
  const db = await getDb();
  
  // Check for active subscription
  const subscription = await db.get(
    `SELECT * FROM subscriptions 
     WHERE user_id = ? AND status = 'active' AND (end_date IS NULL OR end_date > datetime('now'))
     ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );
  
  if (!subscription) {
    return {
      success: false,
      response: NextResponse.json(
        { 
          error: 'Subscription required',
          message: 'You need an active subscription to perform this action',
          requiresSubscription: true
        },
        { status: 403 }
      )
    };
  }
  
  return {
    success: true,
    userId
  };
}