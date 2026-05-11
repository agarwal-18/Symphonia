# Email Verification Setup Guide

## Overview

Symphonia now includes email verification for new user registrations. Users must verify their email before accessing all features.

## Configuration Options

### Option 1: Gmail (Easiest for Development)

**Requirements:**
- Gmail account
- App Password (not your regular Gmail password)

**Steps:**
1. Enable 2-Step Verification on your Google Account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate an app password for "Mail"
4. Copy the 16-character password

**Add to `backend/.env`:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=Symphonia <your-email@gmail.com>
```

### Option 2: Custom SMTP (Recommended for Production)

**Supports:** Any SMTP service (SendGrid, Mailgun, AWS SES, etc.)

**Add to `backend/.env`:**
```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
EMAIL_FROM=Symphonia <noreply@yourdomain.com>
```

### Option 3: SendGrid (Production Ready)

1. Sign up at [SendGrid](https://sendgrid.com)
2. Create an API key
3. Verify sender email

**Add to `backend/.env`:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=Symphonia <your-verified-email@domain.com>
```

### Option 4: Mailgun (Production Ready)

1. Sign up at [Mailgun](https://www.mailgun.com)
2. Get SMTP credentials from dashboard

**Add to `backend/.env`:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASSWORD=your-mailgun-password
EMAIL_FROM=Symphonia <noreply@your-domain.com>
```

## Complete .env Configuration

Add these to your `backend/.env`:

```env
# Email Configuration (choose one method above)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# OR use SMTP
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASSWORD=your-password

EMAIL_FROM=Symphonia <noreply@symphonia.com>
FRONTEND_URL=http://localhost:5173
```

## Testing Email

### Test in Development

1. Set up email config in `.env`
2. Register a new user
3. Check your inbox (and spam folder)
4. Click the verification link

### Test Without Real Email (Development)

For development/testing, you can:
1. Use [Mailtrap](https://mailtrap.io) - free email testing
2. Use [Ethereal Email](https://ethereal.email) - generates test accounts

## Features

### ✅ What's Included

- **Email verification on registration**
- **Resend verification email**
- **Verification status check**
- **Beautiful HTML email templates**
- **Token expiration (24 hours)**
- **Frontend verification page**
- **Verification banner for unverified users**

### Email Template

The verification email includes:
- Symphonia branding
- Clear call-to-action button
- Verification link
- Expiration notice
- Professional HTML design

## API Endpoints

### Public Endpoints

**Verify Email:**
```
POST /api/verification/verify
Body: { "token": "verification-token" }
```

### Authenticated Endpoints

**Check Status:**
```
GET /api/verification/status
Headers: Authorization: Bearer <token>
```

**Resend Email:**
```
POST /api/verification/resend
Headers: Authorization: Bearer <token>
```

## Frontend Routes

- `/verify-email?token=xxx` - Verification page
- Verification banner appears for unverified users

## Troubleshooting

### Emails Not Sending

1. **Check SMTP credentials** - Verify username/password
2. **Check spam folder** - Verification emails might be filtered
3. **Check server logs** - Look for email sending errors
4. **Test connection:**
   ```bash
   # In backend folder
   node -e "const nodemailer = require('nodemailer'); /* test code */"
   ```

### Gmail Issues

- Must use App Password, not regular password
- Enable "Less secure app access" won't work anymore
- 2-Step Verification required for App Passwords

### Common Errors

**"Invalid login"**
- Wrong password (Gmail: use app password)
- Wrong SMTP credentials

**"Connection timeout"**
- Wrong SMTP host/port
- Firewall blocking outbound connections

**"Email not received"**
- Check spam folder
- Verify email address is correct
- Check email service limits/quota

## Production Checklist

- [ ] Use production SMTP service (SendGrid, Mailgun, AWS SES)
- [ ] Set up SPF/DKIM records for your domain
- [ ] Verify sender email address
- [ ] Test email delivery
- [ ] Set up email monitoring
- [ ] Configure email bounce handling
- [ ] Update `FRONTEND_URL` to production URL

## Security Notes

- Verification tokens expire after 24 hours
- Tokens are cryptographically secure (32 bytes random)
- Old tokens are invalidated when new ones are generated
- Email verification is required but can be made optional per route
