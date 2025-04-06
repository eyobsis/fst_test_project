import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { verifyJwtToken } from '../../../lib/jwt';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { checkSubscription } from './middleware';

// Company validation schema
const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  website: z.string().optional(),
  size: z.string().min(1, 'Company size is required'),
  logoUrl: z.string().nullable().optional()
});

export async function POST(request: Request) {
  try {
    // Check subscription
    const subscriptionCheck = await checkSubscription(request);
    if (!subscriptionCheck.success) {
      return subscriptionCheck.response;
    }
    
    const userId = subscriptionCheck.userId;
    const body = await request.json();
    
    // Validate input data
    const validation = companySchema.safeParse(body);
    if (!validation.success) {
      const errorMessage = validation.error.errors.map(e => e.message).join(', ');
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }
    
    const { name, website, size, logoUrl } = validation.data;
    const db = await getDb();
    
    // Create companies table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        website TEXT,
        size TEXT NOT NULL,
        logo_url TEXT,
        owner_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users (id)
      )
    `);
    
    // Check if user already has a company
    const existingCompany = await db.get(
      'SELECT * FROM companies WHERE owner_id = ?',
      [userId]
    );
    
    if (existingCompany) {
      // Update existing company
      await db.run(
        `UPDATE companies 
         SET name = ?, website = ?, size = ?, logo_url = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [name, website || null, size, logoUrl || null, existingCompany.id]
      );
      
      return NextResponse.json({
        message: 'Company updated successfully',
        company: {
          id: existingCompany.id,
          name,
          website,
          size,
          logoUrl,
          owner_id: userId
        }
      });
    }
    
    // Create new company
    const result = await db.run(
      'INSERT INTO companies (name, website, size, logo_url, owner_id) VALUES (?, ?, ?, ?, ?)',
      [name, website || null, size, logoUrl || null, userId]
    );
    
    return NextResponse.json({
      message: 'Company created successfully',
      company: {
        id: result.lastID,
        name,
        website,
        size,
        logoUrl,
        owner_id: userId
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Company creation error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while creating your company' },
      { status: 500 }
    );
  }
}

// Get company information
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
    
    // Get company information
    const company = await db.get(
      'SELECT * FROM companies WHERE owner_id = ?',
      [userId]
    );
    
    // Get subscription information
    const subscription = await db.get(
      `SELECT * FROM subscriptions 
       WHERE user_id = ? AND status = 'active' AND (end_date IS NULL OR end_date > datetime('now'))
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    
    return NextResponse.json({ 
      company: company || null,
      hasActiveSubscription: !!subscription
    });
    
  } catch (error) {
    console.error('Get company error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching company information' },
      { status: 500 }
    );
  }
}