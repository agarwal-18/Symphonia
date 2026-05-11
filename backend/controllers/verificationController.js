import User from '../models/User.js';
import { generateVerificationToken, sendVerificationEmail } from '../utils/emailService.js';

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    // Find user with this token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() } // Token not expired
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired verification token. Please request a new verification email.' 
      });
    }

    // Verify the email
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      message: 'Email verified successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24);

    // Update user
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send email
    try {
      await sendVerificationEmail(user.email, user.username, verificationToken);
      res.json({ 
        message: 'Verification email sent successfully. Please check your inbox.' 
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      res.status(500).json({ 
        message: 'Failed to send verification email. Please try again later.' 
      });
    }
  } catch (error) {
    console.error('Resend verification email error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const checkVerificationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('emailVerified email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      emailVerified: user.emailVerified,
      email: user.email
    });
  } catch (error) {
    console.error('Check verification status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
