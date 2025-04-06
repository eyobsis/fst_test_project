import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { z } from 'zod';

// Email validation schema
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address')
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate email
    const validation = subscribeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }
    
    const { email } = validation.data;
    const db = await getDb();
    
    // Check if email already exists
    const existingSubscriber = await db.get(
      'SELECT * FROM subscribers WHERE email = ?',
      [email]
    );
    
    if (existingSubscriber) {
      return NextResponse.json(
        { message: 'You are already subscribed to our newsletter' },
        { status: 200 }
      );
    }
    
    // Create subscribers table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Add new subscriber
    await db.run(
      'INSERT INTO subscribers (email) VALUES (?)',
      [email]
    );
    
    return NextResponse.json({
      message: 'Successfully subscribed to the newsletter'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process your subscription' },
      { status: 500 }
    );
  }
}