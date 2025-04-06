import jwt from 'jsonwebtoken';

// In production, use environment variables for these secrets
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // 7 days

export function signJwtToken(payload: any) {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });
    return token;
  } catch (error) {
    console.error('JWT signing error:', error);
    throw new Error('Failed to generate authentication token');
  }
}

export function verifyJwtToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}