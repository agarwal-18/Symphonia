import { authenticate } from './auth.js';

/**
 * Middleware to require email verification
 * Use this on routes that require verified email
 */
export const requireVerification = async (req, res, next) => {
  // First authenticate
  await authenticate(req, res, () => {
    // Check if email is verified
    if (!req.user.emailVerified) {
      return res.status(403).json({ 
        message: 'Please verify your email address to access this feature.',
        requiresVerification: true
      });
    }
    next();
  });
};
