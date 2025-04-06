import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { verifyJwtToken } from '../../../../lib/jwt';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Profile update validation schema
const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  companyId: z.number().optional()
});

export async function PUT(request: Request) {
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
    const validation = profileSchema.safeParse(body);
    if (!validation.success) {
      const errorMessage = validation.error.errors.map(e => e.message).join(', ');
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }
    
    const { name, companyId } = validation.data;
    const db = await getDb();
    
    // Update user profile
    await db.run(
      'UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, userId]
    );
    
    // If companyId is provided, create user_companies relationship
    if (companyId) {
      // Create user_companies table if it doesn't exist
      await db.exec(`
        CREATE TABLE IF NOT EXISTS user_companies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          company_id INTEGER NOT NULL,
          role TEXT DEFAULT 'member' NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (company_id) REFERENCES companies (id),
          UNIQUE(user_id, company_id)
        )
      `);
      
      // Check if relationship already exists
      const existingRelation = await db.get(
        'SELECT * FROM user_companies WHERE user_id = ? AND company_id = ?',
        [userId, companyId]
      );
      
      if (!existingRelation) {
        // Create new relationship with admin role for the company owner
        await db.run(
          'INSERT INTO user_companies (user_id, company_id, role) VALUES (?, ?, ?)',
          [userId, companyId, 'admin']
        );
      }
    }
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: userId,
        name,
        companyId
      }
    });
    
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating your profile' },
      { status: 500 }
    );
  }
}