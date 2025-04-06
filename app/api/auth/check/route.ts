import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { verifyJwtToken } from '../../../../lib/jwt';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        nextStep: 'login'
      });
    }
    
    const payload = verifyJwtToken(token);
    if (!payload) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        nextStep: 'login'
      });
    }
    
    const db = await getDb();
    
    // Create subscriptions table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        plan_name TEXT NOT NULL,
        status TEXT NOT NULL,
        payment_method TEXT,
        payment_id TEXT,
        billing_cycle TEXT DEFAULT 'monthly',
        start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
    
    // Create user_setup_status table if it doesn't exist
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
    
    const user = await db.get(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [payload.id]
    );
    
    if (!user) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        nextStep: 'login'
      });
    }
    
    // Get subscription information
    const subscription = await db.get(
      `SELECT * FROM subscriptions 
       WHERE user_id = ? AND status = 'active' AND (end_date IS NULL OR end_date > datetime('now'))
       ORDER BY created_at DESC LIMIT 1`,
      [user.id]
    );
    
    // Get user setup status
    let setupStatus = await db.get(
      'SELECT * FROM user_setup_status WHERE user_id = ?',
      [user.id]
    );
    
    // Create setup status if it doesn't exist
    if (!setupStatus) {
      await db.run(
        'INSERT INTO user_setup_status (user_id) VALUES (?)',
        [user.id]
      );
      
      setupStatus = {
        user_id: user.id,
        has_completed_subscription: 0,
        has_completed_office_setup: 0
      };
    }
    
    // Check company information
    const company = await db.get(
      'SELECT * FROM companies WHERE owner_id = ?',
      [user.id]
    );
    
    // Determine next step in user flow
    let nextStep = 'dashboard';
    
    if (!subscription) {
      nextStep = 'pricing';
    } else if (setupStatus.has_completed_subscription === 0) {
      // Update subscription completion status
      await db.run(
        'UPDATE user_setup_status SET has_completed_subscription = 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [user.id]
      );
      setupStatus.has_completed_subscription = 1;
    }
    
    if (subscription && !company) {
      nextStep = 'setup';
    } else if (subscription && company && setupStatus.has_completed_office_setup === 0) {
      // Update office setup completion status
      await db.run(
        'UPDATE user_setup_status SET has_completed_office_setup = 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [user.id]
      );
      setupStatus.has_completed_office_setup = 1;
      nextStep = 'setup_complete';
    }
    
    return NextResponse.json({
      authenticated: true,
      user,
      subscription: subscription || null,
      hasActiveSubscription: !!subscription,
      setupStatus,
      hasCompany: !!company,
      nextStep
    });
    
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({
      authenticated: false,
      user: null,
      error: 'An unexpected error occurred',
      nextStep: 'login'
    }, { status: 500 });
  }
}