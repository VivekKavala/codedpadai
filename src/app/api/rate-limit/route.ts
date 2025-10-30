import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter, getClientIP } from '@/lib/security';

export async function GET(request: NextRequest) {
  const clientIP = getClientIP(request);
  const limit = 10; // 10 requests per minute
  const windowMs = 60000; // 1 minute
  
  const isAllowed = rateLimiter.isAllowed(clientIP, limit, windowMs);
  const remaining = rateLimiter.getRemaining(clientIP, limit, windowMs);
  const resetTime = rateLimiter.getResetTime(clientIP, windowMs);
  
  const response = NextResponse.json({
    allowed: isAllowed,
    remaining,
    resetTime,
    limit,
  });
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', resetTime.toString());
  
  if (!isAllowed) {
    response.headers.set('Retry-After', Math.ceil((resetTime - Date.now()) / 1000).toString());
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: response.headers }
    );
  }
  
  return response;
}
