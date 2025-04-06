import { NextResponse } from 'next/server';

export async function GET() {
  // Always return authenticated as true to make everything public
  return NextResponse.json({
    authenticated: true,
    hasActiveSubscription: true,
    user: {
      id: 1,
      email: 'demo@example.com',
      name: 'Demo User'
    }
  });
}