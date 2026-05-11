import { sendVerificationEmail } from '../utils/emailService.js';

export const testEmail = async (req, res) => {
  try {
    const { email, username } = req.body;
    
    if (!email || !username) {
      return res.status(400).json({ 
        message: 'Email and username are required',
        example: { email: 'test@example.com', username: 'testuser' }
      });
    }

    // Generate a test token
    const testToken = 'test-token-' + Date.now();
    
    await sendVerificationEmail(email, username, testToken);
    
    res.json({
      success: true,
      message: 'Test email sent successfully!',
      email: email,
      note: 'Check your inbox (and spam folder)'
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message,
      troubleshooting: {
        checkEnv: 'Make sure EMAIL_USER and EMAIL_PASSWORD are set in .env',
        gmail: 'For Gmail, use an App Password, not your regular password',
        smtp: 'Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD if using custom SMTP'
      }
    });
  }
};
