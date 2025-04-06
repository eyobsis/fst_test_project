import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { compare } from 'bcryptjs';
import { signJwtToken } from '../../../../lib/jwt'
import { validate, loginSchema } from '../../../../lib/validation';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validation = validate(loginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    const { email, password } = validation.data!;
    const db = await getDb();
    
    // Find user
    const user = await db.get(
      'SELECT id, email, name, password, role FROM users WHERE email = ?',
      [email]
    );
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Verify password
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = signJwtToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
    
    // Set HTTP-only cookie with the token
    const cookieStore = cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during login' },
      { status: 500 }
    );
  }
}