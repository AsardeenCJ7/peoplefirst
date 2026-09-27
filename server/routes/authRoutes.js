import express from 'express';
import {
  register,
  verifyEmail,
  login,
  changePassword,
  getMe,
  resendVerification,
  googleLogin,
  forgotPassword,
  resetPassword,
  sendOtp,
  verifyOtp,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.put('/change-password', protect, changePassword);
router.get('/get-me', protect, getMe);
router.get('/me', protect, getMe);

export default router;
