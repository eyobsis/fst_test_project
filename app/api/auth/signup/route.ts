import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { hash } from 'bcryptjs';
import { validate, signupSchema } from '../../../../lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validation = validate(signupSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    const { email, password, name } = validation.data!;
    const db = await getDb();
    
    // Check if user already exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash the password
    const hashedPassword = await hash(password, 10);
    
    // Insert the new user
    const result = await db.run(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );
    
    return NextResponse.json({
      id: result.lastID,
      email,
      name,
      message: 'User created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during signup' },
      { status: 500 }
    );
  }
}