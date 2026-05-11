import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  verifyEmail,
  resendVerificationEmail,
  checkVerificationStatus
} from '../controllers/verificationController.js';
import { testEmail } from '../controllers/testEmailController.js';

const router = express.Router();

// Verify email with token (public endpoint)
router.post('/verify', verifyEmail);

// Check verification status (authenticated)
router.get('/status', authenticate, checkVerificationStatus);

// Resend verification email (authenticated)
router.post('/resend', authenticate, resendVerificationEmail);

// Test email endpoint (for debugging - remove in production)
router.post('/test', testEmail);

export default router;

