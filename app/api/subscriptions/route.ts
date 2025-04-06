import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { verifyJwtToken } from '../../../lib/jwt';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Subscription validation schema
const subscriptionSchema = z.object({
  planName: z.string().min(1, 'Plan name is required'),
  planId: z.string().min(1, 'Plan ID is required'),
  billingCycle: z.enum(['monthly', 'yearly'], {
    errorMap: () => ({ message: 'Billing cycle must be monthly or yearly' }),
  }),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  paymentId: z.string().optional()
});

export async function POST(request: Request) {
  try {
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
    const body = await request.json();
    
    // Validate input data
    const validation = subscriptionSchema.safeParse(body);
    if (!validation.success) {
      const errorMessage = validation.error.errors.map(e => e.message).join(', ');
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }
    
    const { planName, planId, billingCycle, paymentMethod, paymentId } = validation.data;
    const db = await getDb();
    
    // Create subscriptions table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        plan_name TEXT NOT NULL,
        plan_id TEXT NOT NULL,
        billing_cycle TEXT NOT NULL,
        status TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        payment_id TEXT,
        start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
    
    // Set end date based on billing cycle
    const endDate = new Date();
    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    // Create new subscription
    const result = await db.run(
      `INSERT INTO subscriptions 
       (user_id, plan_name, plan_id, billing_cycle, status, payment_method, payment_id, end_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, planName, planId, billingCycle, 'active', paymentMethod, paymentId || null, endDate.toISOString()]
    );
    
    // Create or update user setup status
    await db.exec(`
      CREATE TABLE IF NOT EXISTS user_setup_status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        has_completed_subscription BOOLEAN DEFAULT 0,
        has_completed_office_setup BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
    
    // Check if user setup status exists
    const setupStatus = await db.get(
      'SELECT * FROM user_setup_status WHERE user_id = ?',
      [userId]
    );
    
    if (!setupStatus) {
      await db.run(
        'INSERT INTO user_setup_status (user_id, has_completed_subscription) VALUES (?, 1)',
        [userId]
      );
    } else {
      await db.run(
        'UPDATE user_setup_status SET has_completed_subscription = 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [userId]
      );
    }
    
    return NextResponse.json({
      message: 'Subscription created successfully',
      subscription: {
        id: result.lastID,
        planName,
        planId,
        billingCycle,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: endDate.toISOString()
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while creating your subscription' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
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
    
    // Get all user subscriptions
    const subscriptions = await db.all(
      'SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    // Get active subscription
    const activeSubscription = await db.get(
      `SELECT * FROM subscriptions 
       WHERE user_id = ? AND status = 'active' AND (end_date IS NULL OR end_date > datetime('now'))
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    
    return NextResponse.json({
      subscriptions: subscriptions || [],
      activeSubscription: activeSubscription || null,
      hasActiveSubscription: !!activeSubscription
    });
    
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching subscription information' },
      { status: 500 }
    );
  }
}