// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateResetToken } from '@/lib/utils/resetToken';
import { checkResetRateLimit } from '@/lib/utils/rateLimiter';
import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Rate limiting check
    const rateLimitResult = checkResetRateLimit(normalizedEmail);
    if (!rateLimitResult.allowed) {
      const resetTime = rateLimitResult.resetAt;
      return NextResponse.json(
        {
          error: `Too many reset requests. Please try again after ${resetTime?.toLocaleTimeString()}.`,
        },
        { status: 429 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
      },
    });

    // Always return success to prevent email enumeration
    // But only send email if user exists and has a password
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message:
            'If an account exists with this email, you will receive a password reset link.',
        },
        { status: 200 }
      );
    }

    // Check if user signed up with OAuth (no password)
    if (!user.password) {
      return NextResponse.json(
        {
          error:
            'This account uses social login (Google/GitHub). Please sign in with your social account.',
        },
        { status: 400 }
      );
    }

    // Generate reset token
    const resetToken = generateResetToken(user.id, user.email);
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

    // Send email
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"CodedPadAI Support" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Reset Your Password - CodedPadAI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: #f9fafb;
              border-radius: 8px;
              padding: 30px;
              border: 1px solid #e5e7eb;
            }
            .header {
              background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              margin: -30px -30px 20px -30px;
              text-align: center;
            }
            .button {
              display: inline-block;
              background: #2563eb;
              color: white !important;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              margin: 20px 0;
            }
            .warning {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .tips {
              background: #dbeafe;
              border-left: 4px solid #2563eb;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Password Reset Request</h1>
            </div>
            
            <p>Hello${user.name ? ` ${user.name}` : ''},</p>
            
            <p>We received a request to reset your password for your CodedPadAI account. Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: white; padding: 10px; border-radius: 4px; font-size: 12px;">
              ${resetUrl}
            </p>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> This link will expire in <strong>10 minutes</strong>. If you didn't request this password reset, please ignore this email or contact support if you have concerns.
            </div>
            
            <div class="tips">
              <strong>🔒 Security Tips:</strong>
              <ul style="margin: 10px 0;">
                <li>Never share your password with anyone</li>
                <li>Use a unique password for CodedPadAI</li>
                <li>Enable two-factor authentication when available</li>
                <li>Don't click on suspicious links in emails</li>
              </ul>
            </div>
            
            <p>If you have any questions, please contact us at <a href="mailto:legal@codedpadai.com">legal@codedpadai.com</a>.</p>
            
            <p>Best regards,<br>The CodedPadAI Team</p>
            
            <div class="footer">
              <p>This is an automated email from CodedPadAI. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} CodedPadAI. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hello${user.name ? ` ${user.name}` : ''},

We received a request to reset your password for your CodedPadAI account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 10 minutes.

If you didn't request this password reset, please ignore this email.

Security Tips:
- Never share your password with anyone
- Use a unique password for CodedPadAI
- Enable two-factor authentication when available
- Don't click on suspicious links in emails

Best regards,
The CodedPadAI Team

---
This is an automated email from CodedPadAI. Please do not reply to this email.
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Password reset link has been sent to your email.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again later.' },
      { status: 500 }
    );
  }
}
