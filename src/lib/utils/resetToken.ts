// lib/utils/resetToken.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '10m'; // 10 minutes

interface ResetTokenPayload {
  userId: string;
  email: string;
  type: 'password-reset';
}

/**
 * Generate a JWT token for password reset
 */
export function generateResetToken(userId: string, email: string): string {
  const payload: ResetTokenPayload = {
    userId,
    email,
    type: 'password-reset',
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

/**
 * Verify and decode a reset token
 */
export function verifyResetToken(token: string): ResetTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as ResetTokenPayload;

    // Verify it's a password reset token
    if (decoded.type !== 'password-reset') {
      return null;
    }

    return decoded;
  } catch (error) {
    // Token expired, invalid, or malformed
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Check if a token is expired (for custom error messages)
 */
export function isTokenExpired(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET);
    return false;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return true;
    }
    return false;
  }
}
