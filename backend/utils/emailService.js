import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Create reusable transporter object
const createTransporter = () => {
  // Check if email is configured
  const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASSWORD;
  const hasGmail = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;

  if (!hasSmtp && !hasGmail) {
    throw new Error('Email not configured. Please set EMAIL_USER/EMAIL_PASSWORD for Gmail or SMTP_HOST/SMTP_USER/SMTP_PASSWORD for custom SMTP');
  }

  // If SMTP config provided, use it; otherwise use Gmail
  if (hasSmtp) {
    console.log('📧 Using custom SMTP:', process.env.SMTP_HOST);
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  } else {
    // Fallback to Gmail (requires app password)
    console.log('📧 Using Gmail service');
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // App password, not regular password
      },
    });
  }
};

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const sendVerificationEmail = async (email, username, token) => {
  try {
    console.log('📧 Attempting to send verification email to:', email);
    const transporter = createTransporter();
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
    console.log('📧 Verification URL:', verificationUrl);

    const mailOptions = {
      from: `"Symphonia" <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@symphonia.com'}>`,
      to: email,
      subject: 'Verify Your Symphonia Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00d4ff 0%, #a855f7 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #00d4ff 0%, #a855f7 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .code { background: #e0e0e0; padding: 10px; border-radius: 5px; font-family: monospace; word-break: break-all; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎵 Symphonia</h1>
            </div>
            <div class="content">
              <h2>Welcome to Symphonia, ${username}!</h2>
              <p>Thank you for signing up. Please verify your email address to complete your registration and start collaborating on music projects.</p>
              <p>Click the button below to verify your email:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <div class="code">${verificationUrl}</div>
              <p><strong>This link will expire in 24 hours.</strong></p>
              <p>If you didn't create an account with Symphonia, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Symphonia. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Symphonia, ${username}!
        
        Please verify your email address by clicking the link below:
        ${verificationUrl}
        
        This link will expire in 24 hours.
        
        If you didn't create an account, please ignore this email.
      `,
    };

    // Test connection first
    await transporter.verify();
    console.log('✅ Email server connection verified');

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   To:', email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Check your email credentials (EMAIL_USER/EMAIL_PASSWORD or SMTP credentials)');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Could not connect to email server. Check SMTP_HOST and SMTP_PORT');
    } else {
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  }
};

export const sendPasswordResetEmail = async (email, username, token) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Symphonia" <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@symphonia.com'}>`,
      to: email,
      subject: 'Reset Your Symphonia Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00d4ff 0%, #a855f7 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #00d4ff 0%, #a855f7 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎵 Symphonia</h1>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>Hello ${username},</p>
              <p>You requested to reset your password. Click the button below to create a new password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <div class="warning">
                <p><strong>⚠️ This link will expire in 1 hour.</strong></p>
                <p>If you didn't request a password reset, please ignore this email or contact support if you're concerned.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

