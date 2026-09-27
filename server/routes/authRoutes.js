import express from 'express';
import {
  register,
  verifyEmail,
  login,
  changePassword,
  getMe,
  resendVerification,
  googleLogin,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/resend-verification', resendVerification);
router.put('/change-password', protect, changePassword);
router.get('/me', protect, getMe);

export default router;
