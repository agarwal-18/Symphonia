# Email Troubleshooting Guide

## Quick Test

Test your email configuration:

```bash
# Using curl or Postman
POST http://localhost:5000/api/verification/test
Content-Type: application/json

{
  "email": "your-email@gmail.com",
  "username": "testuser"
}
```

Or test in browser console:
```javascript
fetch('http://localhost:5000/api/verification/test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'your-email@gmail.com', username: 'testuser' })
})
.then(r => r.json())
.then(console.log)
```

## Common Issues

### Issue 1: "Email not configured"

**Error:** `Email not configured. Please set EMAIL_USER/EMAIL_PASSWORD...`

**Fix:**
1. Open `backend/.env`
2. Add email configuration (see below)

### Issue 2: "EAUTH" - Authentication Failed

**Error:** `Email authentication failed`

**Causes:**
- Wrong password (Gmail: using regular password instead of App Password)
- Wrong username/email
- 2-Step Verification not enabled (for Gmail)

**Gmail Fix:**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Enable 2-Step Verification
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate app password for "Mail"
5. Use the 16-character password in `.env`

**Custom SMTP Fix:**
- Verify SMTP_USER and SMTP_PASSWORD are correct
- Check if server requires special authentication

### Issue 3: "ECONNECTION" - Connection Failed

**Error:** `Could not connect to email server`

**Fix:**
- Check SMTP_HOST is correct
- Check SMTP_PORT is correct (587, 465, or 25)
- Check firewall isn't blocking outbound connections
- Verify internet connection

### Issue 4: Email Goes to Spam

**Symptoms:** Email sent but not in inbox

**Fix:**
1. Check spam/junk folder
2. Mark as "Not Spam"
3. For production: Set up SPF/DKIM records

### Issue 5: No Error, But No Email

**Symptoms:** Backend says "email sent" but nothing received

**Check:**
1. Check backend console for errors
2. Verify email address is correct
3. Check spam folder
4. Test with a different email address
5. Verify email service limits/quota

## Configuration Examples

### Gmail Setup

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # 16-char app password
EMAIL_FROM=Symphonia <your-email@gmail.com>
FRONTEND_URL=http://localhost:5173
```

### SendGrid Setup

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=Symphonia <your-verified-email@domain.com>
FRONTEND_URL=http://localhost:5173
```

### Mailgun Setup

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASSWORD=your-mailgun-password
EMAIL_FROM=Symphonia <noreply@your-domain.com>
FRONTEND_URL=http://localhost:5173
```

### Custom SMTP

```env
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASSWORD=your-password
EMAIL_FROM=Symphonia <noreply@yourdomain.com>
FRONTEND_URL=http://localhost:5173
```

## Debug Steps

### Step 1: Check Backend Console

Look for these messages:
- `📧 Using Gmail service` or `📧 Using custom SMTP`
- `✅ Email server connection verified`
- `✅ Verification email sent successfully!`
- `❌ Error sending verification email: ...`

### Step 2: Verify Configuration

```bash
# Check if variables are loaded (in backend folder)
node -e "require('dotenv').config(); console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET')"
```

### Step 3: Test Email Connection

Use the test endpoint:
```bash
POST http://localhost:5000/api/verification/test
```

### Step 4: Check Email Service

- Gmail: Check [Google Account Activity](https://myaccount.google.com/security)
- SendGrid: Check [SendGrid Dashboard](https://app.sendgrid.com/)
- Mailgun: Check [Mailgun Dashboard](https://app.mailgun.com/)

## Still Not Working?

1. **Check backend logs** for detailed error messages
2. **Try different email provider** (Gmail → SendGrid or vice versa)
3. **Test with simpler email** (plain text instead of HTML)
4. **Verify SMTP credentials** are correct
5. **Check email service status** (some services have outages)

## Production Recommendations

- Use dedicated email service (SendGrid, Mailgun, AWS SES)
- Set up SPF/DKIM records for your domain
- Monitor email delivery rates
- Handle bounces and complaints
- Use proper "From" address with verified domain

## Quick Fix: Disable Email (Development Only)

If you just want to test registration without email:

Temporarily comment out in `backend/controllers/authController.js`:
```javascript
// await sendVerificationEmail(user.email, user.username, verificationToken);
```

Then manually verify users in database or skip verification check.
