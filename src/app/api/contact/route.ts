// app/api/contact/route.ts (App Router)
// OR pages/api/contact.ts (Pages Router)

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email configuration based on category
const EMAIL_RECIPIENTS = {
  general: 'vivekkavala63@gmail.com',
  privacy: 'vivekkavala63@gmail.com',
  dmca: 'vivekkavala63@gmail.com',
  legal: 'vivekkavala63@gmail.com',
};

// Rate limiting (simple in-memory store - use Redis in production)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userRequests = rateLimitStore.get(identifier) || [];

  // Remove old requests outside the window
  const recentRequests = userRequests.filter(
    (timestamp: number) => now - timestamp < RATE_LIMIT_WINDOW
  );

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  recentRequests.push(now);
  rateLimitStore.set(identifier, recentRequests);
  return true;
}

// Create email transporter (configure with your email service)
// Option 1: Using Gmail (requires App Password)
// Option 2: Using SendGrid, Mailgun, AWS SES, etc.
const createTransporter = () => {
  return nodemailer.createTransport({
    // Gmail configuration
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER, // your-email@gmail.com
      pass: process.env.SMTP_PASSWORD, // App Password
    },

    // OR SMTP configuration for other providers
    // host: process.env.SMTP_HOST,
    // port: parseInt(process.env.SMTP_PORT || '587'),
    // secure: process.env.SMTP_SECURE === 'true',
    // auth: {
    //   user: process.env.SMTP_USER,
    //   pass: process.env.SMTP_PASSWORD,
    // },
  });
};

// Validation function
function validateContactForm(data: any) {
  const errors: string[] = [];

  if (
    !data.name ||
    typeof data.name !== 'string' ||
    data.name.trim().length < 2
  ) {
    errors.push('Name must be at least 2 characters');
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format');
    }
  }

  if (
    !data.category ||
    !EMAIL_RECIPIENTS[data.category as keyof typeof EMAIL_RECIPIENTS]
  ) {
    errors.push('Invalid category');
  }

  if (
    !data.subject ||
    typeof data.subject !== 'string' ||
    data.subject.trim().length < 5
  ) {
    errors.push('Subject must be at least 5 characters');
  }

  if (
    !data.message ||
    typeof data.message !== 'string' ||
    data.message.trim().length < 10
  ) {
    errors.push('Message must be at least 10 characters');
  }

  // Sanitize inputs
  if (data.name) data.name = data.name.trim().slice(0, 100);
  if (data.email) data.email = data.email.trim().toLowerCase().slice(0, 100);
  if (data.subject) data.subject = data.subject.trim().slice(0, 200);
  if (data.message) data.message = data.message.trim().slice(0, 5000);

  return { valid: errors.length === 0, errors, data };
}

// For App Router (app/api/contact/route.ts)
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateContactForm(body);

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const { name, email, category, subject, message } = validation.data;
    const recipientEmail =
      EMAIL_RECIPIENTS[category as keyof typeof EMAIL_RECIPIENTS];

    // Create email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #1f2937; }
          .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
            <p>Category: ${category.toUpperCase()}</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">From:</div>
              <div class="value">${name} (${email})</div>
            </div>
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${subject}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${message.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="field">
              <div class="label">Submitted:</div>
              <div class="value">${new Date().toLocaleString()}</div>
            </div>
            <div class="field">
              <div class="label">IP Address:</div>
              <div class="value">${ip}</div>
            </div>
          </div>
          <div class="footer">
            <p>This email was sent from the CodedPadAI.com contact form</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `
New Contact Form Submission

Category: ${category.toUpperCase()}
From: ${name} (${email})
Subject: ${subject}

Message:
${message}

Submitted: ${new Date().toLocaleString()}
IP Address: ${ip}

---
This email was sent from the CodedPadAI.com contact form
    `;

    // Send email
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"CodedPadAI Contact" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `[${category.toUpperCase()}] ${subject}`,
      text: emailText,
      html: emailHtml,
    });

    // Optional: Send confirmation email to user
    await transporter.sendMail({
      from: `"CodedPadAI Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'We received your message - CodedPadAI',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Thank You for Contacting Us!</h2>
            <p>Hi ${name},</p>
            <p>We've received your message and will get back to you within 24-48 hours.</p>
            <p><strong>Your message details:</strong></p>
            <p style="background: #f9fafb; padding: 15px; border-radius: 4px;">
              <strong>Category:</strong> ${category}<br>
              <strong>Subject:</strong> ${subject}
            </p>
            <p>If you have any additional information to add, feel free to reply to this email.</p>
            <p>Best regards,<br>The CodedPadAI Team</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="font-size: 12px; color: #6b7280;">
              This is an automated response. Please do not reply to this email if you did not submit a contact form on CodedPadAI.com.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
