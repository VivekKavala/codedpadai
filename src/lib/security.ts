import DOMPurify from 'dompurify';

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  // Remove any HTML tags and sanitize the input
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  }).trim();
}

/**
 * Validate pad title
 */
export function validateTitle(title: string): { isValid: boolean; error?: string } {
  const sanitized = sanitizeInput(title);
  
  if (!sanitized) {
    return { isValid: false, error: 'Title is required' };
  }
  
  if (sanitized.length > 200) {
    return { isValid: false, error: 'Title must be less than 200 characters' };
  }
  
  return { isValid: true };
}

/**
 * Validate pad content
 */
export function validateContent(content: string): { isValid: boolean; error?: string } {
  const sanitized = sanitizeInput(content);
  
  if (!sanitized) {
    return { isValid: false, error: 'Content is required' };
  }
  
  if (sanitized.length > 100000) {
    return { isValid: false, error: 'Content must be less than 100,000 characters' };
  }
  
  return { isValid: true };
}

/**
 * Validate passphrase
 */
export function validatePassphrase(passphrase: string): { isValid: boolean; error?: string } {
  if (!passphrase) {
    return { isValid: false, error: 'Passphrase is required' };
  }
  
  if (passphrase.length < 4) {
    return { isValid: false, error: 'Passphrase must be at least 4 characters' };
  }
  
  if (passphrase.length > 100) {
    return { isValid: false, error: 'Passphrase must be less than 100 characters' };
  }
  
  return { isValid: true };
}

/**
 * Rate limiting helper (simple in-memory implementation)
 * In production, use Redis or a proper rate limiting service
 */
class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  
  isAllowed(key: string, limit: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.requests.get(key);
    
    if (!record || now > record.resetTime) {
      this.requests.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (record.count >= limit) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  getRemaining(key: string, limit: number = 10, windowMs: number = 60000): number {
    const now = Date.now();
    const record = this.requests.get(key);
    
    if (!record || now > record.resetTime) {
      return limit;
    }
    
    return Math.max(0, limit - record.count);
  }
  
  getResetTime(key: string, windowMs: number = 60000): number {
    const record = this.requests.get(key);
    if (!record) return Date.now() + windowMs;
    return record.resetTime;
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Get client IP for rate limiting
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}
